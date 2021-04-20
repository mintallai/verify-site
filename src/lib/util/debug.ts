import reduceDeep from 'deepdash/reduceDeep';

export function logVerificationErrors(summary: ISummaryResponse | null) {
  if (summary) {
    const errors = reduceDeep(
      summary,
      (acc, value, key, parent, ctx) => {
        if (key === 'errors' && value.length) {
          value.forEach((error) => {
            acc.push({ path: ctx.path, error });
          });
        }
        return acc;
      },
      [],
    );
    if (errors.length > 0) {
      console.group(
        `%c${errors.length} verification error(s) found`,
        'color: red;',
      );
      errors.forEach(({ path, error }) => {
        console.error(`Error at path '${path}':`, error);
      });
      console.groupEnd();
    } else {
      console.log('✅ %cNo verification errors found', 'color: #20d450;');
    }
  }
}
