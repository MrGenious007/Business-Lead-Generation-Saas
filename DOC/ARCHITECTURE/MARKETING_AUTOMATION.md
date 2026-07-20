# Marketing Automation

## Overview

Marketing automation is one of the key planned capabilities for LeadPilot AI. The repository currently includes a placeholder `packages/marketing` package, but the automation workflows and campaign execution layers are not yet implemented.

## Current Status

- `packages/marketing` exists as a workspace package stub.
- The root app has no campaign builder or automation engine implemented.
- Notifications are referenced in `services/notifications`, but integration modules are missing.

## Target Capabilities

### Campaign Management

- Create campaigns for email, WhatsApp, SMS, and social media.
- Schedule campaign windows, budgets, and audiences.
- Link campaigns to CRM segments and lead status filters.

### Messaging Templates

- Store reusable templates for email, WhatsApp, and SMS.
- Support personalization tokens for contact name, company, and deal stage.
- Preview and test templates before sending.

### Automation Workflows

- Define workflows triggered by events such as lead creation, lead status change, deal stage update, or time-based actions.
- Support branching logic and delays.
- Allow users to build workflows visually or through declarative rules.

### Delivery Channels

- Email via Resend or SMTP provider.
- WhatsApp via WhatsApp Cloud API.
- SMS via a supported messaging provider.
- Future channels: social ads, push notifications, and webhooks.

### Analytics and Reporting

- Track opens, clicks, replies, conversions, and campaign ROI.
- Report on automation workflow performance.
- Surface automated recommendations for next actions.

## Architecture

### Domain Model

Key tables and entities required:
- `campaigns`
- `campaign_messages`
- `automation_workflows`
- `automation_steps`
- `automation_triggers`
- `automation_executions`
- `notifications`
- `notification_logs`

### Service layer

The current `services/notifications` module is a starting point for channel dispatch and logging. It should evolve into a robust messaging service provider abstraction.

### Policy and Compliance

- Respect unsubscribe and opt-out preferences.
- Track consent and opt-in status for contacts.
- Avoid sending messages to contacts outside agreed permissions.
- Log delivery status and error reasons for failed sends.

## Recommended API surface

- `POST /api/marketing/campaigns`
- `GET /api/marketing/campaigns`
- `PATCH /api/marketing/campaigns/{campaignId}`
- `POST /api/marketing/automation`
- `POST /api/marketing/automation/{workflowId}/run`
- `POST /api/notifications/send`
- `GET /api/notifications/logs`

## Next Steps

- Implement a sponsorship flow to convert CRM segments into campaign audiences.
- Add automation triggers for lead state changes and scheduled follow-ups.
- Create a notification dispatcher that routes to email, SMS, and WhatsApp providers.
- Add analytics to the campaign and automation dashboards.
