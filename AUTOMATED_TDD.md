# 🤖 Automated TDD Workflow

This repository features an automated Test-Driven Development workflow that transforms GitHub issues into ready-to-implement TDD setups.

## 🚀 How It Works

### Automatic Flow (GitHub)

1. **Create an Issue** using the Feature Request template
2. **Bot automatically**:
   - Creates a feature branch
   - Generates component scaffold
   - Creates comprehensive tests based on requirements
   - Opens a draft PR with failing tests
3. **Developer** implements the component to pass tests

### Local Flow (Faster Development)

```bash
npm run tdd:auto
```

Interactive CLI that:
- Guides you through requirements gathering
- Generates tests locally
- Creates branch and commits
- No waiting for GitHub Actions

## 📋 Issue Template Structure

The automation parses specific sections from the issue:

```markdown
[FEATURE] ComponentName - Description

## User Story
As a [user], I want [feature] so that [benefit]

## Acceptance Criteria
- [ ] Given X, when Y, then Z
- [ ] Component renders correctly
- [ ] User can interact with feature

## Component Details
**Props**: prop1, prop2
**Events**: click, submit
**State Management**: Yes/No

## Test Scenarios
### Happy Path
- User completes normal flow

### Edge Cases
- Empty data handling

### Error Cases  
- Network failures
```

## 🔧 Configuration

### GitHub Actions Setup

1. **Add API Keys** (optional but recommended):
   - Go to Settings → Secrets → Actions
   - Add `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`
   - Without keys, uses template-based generation

2. **Permissions**:
   - Ensure Actions can create branches and PRs
   - Settings → Actions → General → Workflow permissions
   - Check "Read and write permissions"

### Local Setup

```bash
# For AI-enhanced test generation
export OPENAI_API_KEY="your-key"
# or
export ANTHROPIC_API_KEY="your-key"
```

## 🎯 Workflow Steps

### 1. GitHub Issue Created
```
User creates issue with [FEATURE] label
     ↓
```

### 2. Automation Triggers
```
GitHub Action parses issue
     ↓
Extracts: component name, requirements, test scenarios
     ↓
```

### 3. Branch Creation
```
Creates: feature/123-component-name
     ↓
```

### 4. Test Generation
```
AI analyzes requirements (if API key available)
     ↓
Generates comprehensive tests:
- Testing Library tests (user-centric)
- Vue Test Utils tests (component-centric)
- Accessibility tests
- All tests fail initially (RED phase)
     ↓
```

### 5. Draft PR Created
```
Opens PR with:
- Failing tests
- Link to issue
- Implementation instructions
     ↓
```

### 6. Developer Takes Over
```
git fetch origin
git checkout feature/123-component-name
npm run tdd
# Implement component (GREEN phase)
# Refactor (REFACTOR phase)
```

## 🤖 AI Test Generation

When API keys are configured, the AI:

1. **Analyzes** acceptance criteria
2. **Generates** test cases for:
   - Each acceptance criterion
   - User interactions
   - Accessibility requirements
   - Edge cases
   - Error scenarios
3. **Uses** both Testing Library and Vue Test Utils
4. **Ensures** tests fail initially (TDD principle)

### Example AI Prompt
```javascript
Generate Vue.js tests for ${componentName}:
- User Story: ${userStory}
- Criteria: ${acceptanceCriteria}
- Use Testing Library for user interactions
- Include accessibility tests
- Tests should fail initially
```

## 📝 Local Interactive Mode

```bash
npm run tdd:auto
```

Guides you through:
1. Component naming
2. User story definition
3. Acceptance criteria
4. Test scenarios
5. UI/UX requirements

Then automatically:
- Creates branch
- Generates tests
- Commits with proper message
- Provides next steps

## 🎨 Customization

### Custom Test Templates

Edit `scripts/test-generator.js` to modify:
- Default test structure
- Assertion patterns
- Test organization

### AI Prompts

Modify AI prompts in:
- `.github/workflows/auto-tdd-setup.yml` (GitHub)
- `scripts/auto-tdd-local.js` (Local)

## 📊 Tracking

Local tracking file `.tdd-tracking.json`:
```json
{
  "UserProfile": {
    "branch": "feature/1234-user-profile",
    "created": "2024-03-15T10:00:00Z",
    "status": "red"
  }
}
```

## 🚦 Status Indicators

- 🔴 **RED**: Tests created, failing (awaiting implementation)
- 🟡 **YELLOW**: Partially passing (in progress)
- 🟢 **GREEN**: All tests passing (ready for refactor)
- 🔵 **BLUE**: Refactored and complete

## 💡 Best Practices

1. **Complete Issue Template**: More detail = better tests
2. **Use Descriptive Names**: `[FEATURE] UserProfileCard` not `[FEATURE] Component1`
3. **Clear Acceptance Criteria**: Specific criteria = specific tests
4. **Review Generated Tests**: AI/templates are starting points
5. **Iterate**: Refine tests as you implement

## 🔍 Troubleshooting

### Tests Not Generated
- Check issue has `feature-request` label
- Verify GitHub Actions are enabled
- Check API keys are set (for AI generation)

### Branch Already Exists
- Delete old branch or use different component name
- Check `.tdd-tracking.json` for existing components

### AI Generation Fails
- Falls back to template generation
- Check API key validity
- Review API rate limits

## 📈 Metrics

Track TDD adoption:
```bash
# Count components using TDD
ls src/components/*.test.ts | wc -l

# Check coverage
npm run test:coverage

# View TDD tracking
cat .tdd-tracking.json | jq
```

## 🎓 Learning Resources

- [TDD Workflow Guide](./TDD_WORKFLOW.md)
- [Testing Comparison](./TESTING_COMPARISON.md)
- [Vue Testing Alignment](./VUE_TESTING_ALIGNMENT.md)

## 🤝 Contributing

To improve automation:
1. Enhance test templates in `test-generator.js`
2. Improve issue parsing in workflow
3. Add more AI providers
4. Create better fallback templates

---

Remember: Automation starts the TDD process, but thoughtful implementation completes it! 🚀
