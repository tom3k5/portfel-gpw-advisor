---
description: Set up push notification system for portfolio reports
---

You are implementing the notification system (Etap 1, Week 4).

**Context**: App sends portfolio reports twice daily (8:00 and 16:00 CET) via push notifications.

**Requirements from spec**:
- Push notifications for mobile (Expo Notifications)
- Email notifications for web/backup (Nodemailer)
- Scheduled delivery at 8:00 and 16:00 CET
- Static report content showing portfolio changes

**Your task**:
1. Set up Expo Push Notifications:
   - Configure in `apps/expo/app.json`
   - Request permissions on app launch
   - Store push tokens
   - Create notification handler

2. Create notification service in `packages/logic/src/services/notifications.ts`:
   - `schedulePortfolioReport()` - schedule notification
   - `sendImmediateReport()` - send on-demand
   - `generateReportContent(portfolio)` - create message text

3. Implement mock API endpoint in backend:
   - POST `/api/notifications/schedule` - schedule user notifications
   - POST `/api/notifications/send` - trigger immediate send
   - Background job for scheduled sends (use node-cron)

4. Report content should include:
   - Total portfolio value
   - Daily change (% and PLN)
   - Top 3 gainers/losers
   - Simple recommendations

5. Configure notification scheduling:
   - Use `expo-notifications` for local scheduling
   - Implement server-side cron for production
   - Handle timezone conversion (CET)

6. Add notification preferences screen:
   - Enable/disable notifications
   - Choose notification times
   - Select report verbosity

**Testing**:
- Test immediate notifications
- Verify notification content formatting
- Check timezone handling

**Expected deliverable**: Working notification system sending scheduled portfolio reports
