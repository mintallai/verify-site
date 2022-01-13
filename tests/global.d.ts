declare namespace PlaywrightTest {
  type BadgeType = import('../src/lib/types').BadgeType;

  interface Matchers<R> {
    toHaveCAIBadge(badgeType: BadgeType): Promise<R>;
  }
}
