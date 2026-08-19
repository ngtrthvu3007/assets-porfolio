import { Injectable } from '@nestjs/common';
import {
  DEFAULT_APP_TIMEZONE,
  PRICE_DETAIL_RANGE,
  PRICE_DETAIL_RANGE_ROLLING_DAYS,
} from '@shared';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import type {
  ChartRange,
  ChartTimestamped,
  ResolvedDateRange,
} from './charts.types';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isoWeek);

@Injectable()
export class ChartsService {
  // Maps a range preset (rolling: today/7d/15d/30d, calendar: this_week/
  // last_week/this_month/last_month, or custom) to a concrete [start, end]
  // window in UTC, resolved against the app timezone's calendar boundaries.
  public resolveDateRangeService(
    range: ChartRange,
    custom?: { endDate?: string; startDate?: string },
  ): ResolvedDateRange {
    const appTimezone = process.env.APP_TIMEZONE ?? DEFAULT_APP_TIMEZONE;
    const now = dayjs();
    const nowInAppTz = dayjs().tz(appTimezone);

    switch (range) {
      case PRICE_DETAIL_RANGE.TODAY:
        return { end: now.toDate(), start: nowInAppTz.startOf('day').toDate() };

      case PRICE_DETAIL_RANGE.SEVEN_D:
      case PRICE_DETAIL_RANGE.FIFTEEN_D:
      case PRICE_DETAIL_RANGE.THIRTY_D: {
        const rollingDays = PRICE_DETAIL_RANGE_ROLLING_DAYS[range] ?? 0;
        return {
          end: now.toDate(),
          start: now.subtract(rollingDays, 'day').toDate(),
        };
      }

      case PRICE_DETAIL_RANGE.THIS_WEEK:
        return {
          end: now.toDate(),
          start: nowInAppTz.startOf('isoWeek').toDate(),
        };

      case PRICE_DETAIL_RANGE.LAST_WEEK: {
        const lastWeekInAppTz = nowInAppTz.subtract(1, 'week');
        return {
          end: lastWeekInAppTz.endOf('isoWeek').toDate(),
          start: lastWeekInAppTz.startOf('isoWeek').toDate(),
        };
      }

      case PRICE_DETAIL_RANGE.THIS_MONTH:
        return {
          end: now.toDate(),
          start: nowInAppTz.startOf('month').toDate(),
        };

      case PRICE_DETAIL_RANGE.LAST_MONTH: {
        const lastMonthInAppTz = nowInAppTz.subtract(1, 'month');
        return {
          end: lastMonthInAppTz.endOf('month').toDate(),
          start: lastMonthInAppTz.startOf('month').toDate(),
        };
      }

      case PRICE_DETAIL_RANGE.CUSTOM:
        throw new Error('Custom range is not implemented yet');

      default:
        throw new Error(`Unsupported range: ${range as string}`);
    }
  }

  // range="today" keeps every intraday point; other ranges collapse to one
  // point per calendar day (that day's latest) so a 30d chart isn't ~1,440
  // 30-minute snapshots.
  // TODO: dedupes in JS post-fetch, not at the DB layer — SQLite has no
  // DISTINCT ON, and Postgres (the planned migration target) does, so this
  // avoids SQLite-only SQL that'd be rewritten anyway. Revisit if volume grows.
  public dedupeByDayService<Point extends ChartTimestamped>(
    points: Point[],
    range: ChartRange,
  ): Point[] {
    if (range === PRICE_DETAIL_RANGE.TODAY) return points;

    const appTimezone = process.env.APP_TIMEZONE ?? DEFAULT_APP_TIMEZONE;
    const lastPointByDay = new Map<string, Point>();

    // `points` must already be sorted ascending by sourceUpdatedAt (as
    // listQuotesInRangeRepo returns them) — Map.set() overwrites on repeat
    // keys, so the last write per day ends up being that day's latest point.
    for (const point of points) {
      const dayKey = dayjs(point.sourceUpdatedAt).tz(appTimezone).format('YYYY-MM-DD');
      lastPointByDay.set(dayKey, point);
    }

    return [...lastPointByDay.values()];
  }
}
