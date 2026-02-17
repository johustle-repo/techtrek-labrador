# TechTrek Labrador SUS Test Script

This script is ready for thesis usability sessions using the System Usability Scale (SUS).

## 1. Pre-Test Setup

- Seed database:
  - `php artisan migrate:fresh --seed`
- Verify test accounts:
  - `super_admin`: `superadmin@techtrek.local` / `SuperAdmin123!`
  - `lgu_admin`: `lguadmin@techtrek.local` / `LguAdmin123!`
  - `business_owner`: `owner@techtrek.local` / `Owner123!`
  - `tourist`: `tourist@techtrek.local` / `Tourist123!`
- Prepare test links:
  - Home: `/`
  - CMS Dashboard: `/cms/dashboard`
  - Super Admin Dashboard: `/superadmin/dashboard`

## 2. Moderator Script

1. Brief participant:
   - "This is a usability test of the system, not of your skills."
2. Ask participant to think aloud.
3. Run role-based task set from `docs/TECHTREK_USABILITY_CHECKPOINTS.md`.
4. Do not coach unless participant is blocked for more than 2 minutes.
5. After tasks, collect SUS answers.

## 3. SUS Questionnaire (1 to 5 scale)

Scale:
- 1 = Strongly Disagree
- 2 = Disagree
- 3 = Neutral
- 4 = Agree
- 5 = Strongly Agree

Items:
1. I think that I would like to use this system frequently.
2. I found the system unnecessarily complex.
3. I thought the system was easy to use.
4. I think that I would need the support of a technical person to use this system.
5. I found the various functions in this system were well integrated.
6. I thought there was too much inconsistency in this system.
7. I would imagine that most people would learn to use this system very quickly.
8. I found the system very cumbersome to use.
9. I felt very confident using the system.
10. I needed to learn a lot of things before I could get going with this system.

## 4. SUS Scoring

For odd-numbered items (1,3,5,7,9):
- score contribution = response - 1

For even-numbered items (2,4,6,8,10):
- score contribution = 5 - response

Total contribution x 2.5 = SUS score (0 to 100).

## 5. Suggested Interpretation

- `>= 80.3`: Excellent usability
- `68 to 80.2`: Good / above average
- `< 68`: Needs improvement

## 6. Session Output Checklist

- Participant profile recorded
- Task completion data captured
- SUS answers complete
- Final SUS score computed
- Key pain points summarized
