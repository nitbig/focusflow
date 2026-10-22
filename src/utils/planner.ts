import { EnergyLevel, FocusTask, PlanSuggestion } from '../types';
import { getLocalTodayStr } from './storage';

/**
 * Transparent, deterministic daily-plan recommendation algorithm.
 * Balances available time budget, energy level, deadlines, and priorities.
 */
export function generatePlanSuggestion(
  tasks: FocusTask[],
  energy: EnergyLevel,
  availableMinutes: number
): PlanSuggestion {
  const todayStr = getLocalTodayStr();

  // Exclude completed tasks
  const candidateTasks = tasks.filter((t) => t.status !== 'completed');

  if (candidateTasks.length === 0) {
    return {
      suggestedTasks: [],
      totalMinutes: 0,
      availableMinutes,
      rationale: 'Your backlog is clear.',
      subtext: 'Add a task or take a restful break today.',
      energyLevel: energy,
    };
  }

  // Score each task deterministically
  const scored = candidateTasks.map((task) => {
    let score = 0;

    // 1. In-progress tasks have natural continuity
    if (task.status === 'in_progress') {
      score += 35;
    }

    // 2. Deadline proximity
    if (task.deadline) {
      if (task.deadline <= todayStr) {
        score += 50; // Due today or overdue
      } else {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().slice(0, 10);
        if (task.deadline === tomorrowStr) {
          score += 25; // Due tomorrow
        } else {
          score += 10;
        }
      }
    }

    // 3. Priority weight
    if (task.priority === 'high') score += 30;
    else if (task.priority === 'normal') score += 15;
    else if (task.priority === 'low') score += 5;

    // 4. Energy fit
    if (energy === 'low') {
      // Favor low or any energy fit, and shorter duration (<=25 min)
      if (task.energyFit === 'low') score += 35;
      else if (task.energyFit === 'any') score += 25;
      else if (task.energyFit === 'high') score -= 20;

      if (task.estimateMinutes <= 15) score += 25;
      else if (task.estimateMinutes <= 25) score += 15;
      else if (task.estimateMinutes > 40) score -= 15;
    } else if (energy === 'steady') {
      // Balanced
      if (task.energyFit === 'steady') score += 25;
      else if (task.energyFit === 'any') score += 20;
      else if (task.energyFit === 'low') score += 15;

      if (task.estimateMinutes <= 30) score += 10;
    } else {
      // High energy: demanding or substantial tasks encouraged
      if (task.energyFit === 'high') score += 30;
      else if (task.energyFit === 'any') score += 20;
      if (task.estimateMinutes >= 30) score += 15;
    }

    return { task, score };
  });

  // Sort descending by score; tie-break: shorter first if low energy, then alphabetical
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (energy === 'low') return a.task.estimateMinutes - b.task.estimateMinutes;
    return a.task.title.localeCompare(b.task.title);
  });

  // Target budget leaving ~10-15% buffer
  const targetBudget = Math.max(15, Math.floor(availableMinutes * 0.9));
  const selected: FocusTask[] = [];
  let totalTime = 0;

  for (const item of scored) {
    const task = item.task;
    if (totalTime + task.estimateMinutes <= availableMinutes) {
      selected.push(task);
      totalTime += task.estimateMinutes;
      if (totalTime >= targetBudget && selected.length >= 2) {
        break; // comfortable packing with buffer
      }
    } else if (selected.length === 0 && task.estimateMinutes <= availableMinutes + 15) {
      // If the first task takes nearly the entire budget, show it as single focus block
      selected.push(task);
      totalTime += task.estimateMinutes;
      break;
    }
  }

  // Fallback: if nothing fit, pick the shortest candidate
  if (selected.length === 0 && scored.length > 0) {
    const shortest = [...candidateTasks].sort(
      (a, b) => a.estimateMinutes - b.estimateMinutes
    )[0];
    selected.push(shortest);
    totalTime = shortest.estimateMinutes;
  }

  // Plain-language explanation
  const topTask = selected[0];
  let rationale = '';
  let subtext = '';

  if (topTask) {
    const isDueToday = topTask.deadline && topTask.deadline <= todayStr;
    if (isDueToday && topTask.priority === 'high') {
      rationale = `High priority deadline first: “${topTask.title}” (${topTask.estimateMinutes}m).`;
      subtext = `Due today and fits comfortably inside your ${availableMinutes}m window.`;
    } else if (energy === 'low' && topTask.estimateMinutes <= 25) {
      rationale = `A ${topTask.estimateMinutes}-minute task first: you have ${availableMinutes} minutes and selected low energy.`;
      subtext = 'Gentle momentum over pressure. Surfacing low-friction tasks that won’t drain your focus.';
    } else if (energy === 'high') {
      rationale = `Deep work first: you have high energy and ${availableMinutes} minutes available.`;
      subtext = `Making meaningful progress on “${topTask.title}” while mental energy is sharpest.`;
    } else {
      rationale = `A steady pace: ${selected.length} tasks totaling ${totalTime}m for your ${availableMinutes}m window.`;
      subtext = `Leaves a ${Math.max(0, availableMinutes - totalTime)}m buffer so you never feel rushed.`;
    }
  }

  return {
    suggestedTasks: selected,
    totalMinutes: totalTime,
    availableMinutes,
    rationale,
    subtext,
    energyLevel: energy,
  };
}
