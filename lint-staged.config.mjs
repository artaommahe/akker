const isCheckMode = process.env.LINT_CHECK === 'true';

export default {
  '*': [
    `eslint --no-warn-ignored ${!isCheckMode && '--fix'}`,
    `prettier --ignore-unknown ${isCheckMode ? '--check' : '--write'}`,
  ],
};
