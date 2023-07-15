#!/bin/bash

curl \
  -X PUT \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: token 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" \
  https://api.github.com/repos/daeuniverse/daed-1/branches/main/protection \
  -d '{"required_status_checks":{"strict":true,"contexts":["dae-bot[bot]/build-bundle"]},"enforce_admins":true,"required_pull_request_reviews":{"dismissal_restrictions":{"users":["octocat"],"teams":["justice-league"]},"dismiss_stale_reviews":true,"require_code_owner_reviews":true,"required_approving_review_count":2,"bypass_pull_request_allowances":{"users":["octocat"],"teams":["justice-league"]}},"restrictions":{"users":["octocat"],"teams":["justice-league"],"apps":["super-ci"]},"required_linear_history":true,"allow_force_pushes":true,"allow_deletions":true,"block_creations":true,"required_conversation_resolution":true}'
