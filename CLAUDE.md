# הנחיות לסוכנים

## אנימציות
כל בקשה לאנימציה, סרטון, ריל, אייקון או לוגו זז, או אזור מונפש בדף, עוברת דרך הסקיל `animation-styles` (`.claude/skills/animation-styles/SKILL.md`), או דרך הסוכן `animator`.
- 20 סגנונות, כולם בקוד, ויצוא ל-MP4 בלי תוכנת עריכה. בסקיל יש מתכון ומשפט מדויק לכל סגנון.
- נקודת התחלה שעובדת: `.claude/skills/animation-styles/styles.html`. רינדור: `node .claude/skills/animation-styles/render.cjs --style <n|id> --out <file>.mp4`.
- אנימציה בתוך הדף: `<canvas>` עם `requestAnimationFrame` שקורא ל-`renderAt(t)`. ב-`prefers-reduced-motion` מציגים פריים קבוע. אין ספריות חיצוניות.
- סרטונים שמייצרים נשמרים ב-`media/`, ולא ליד קבצי האתר.
