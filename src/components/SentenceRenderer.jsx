import React, { useMemo } from 'react';

/**
 * Renders an English sentence with S/V/O color highlighting.
 * S → blue underline, V → red underline, O → green underline.
 *
 * Props:
 *   sentence: { english, chinese, structure: { S, V, O, Adv?, Adj? } }
 *   showChinese: whether to show the Chinese translation
 */
export default function SentenceRenderer({ sentence, showChinese = false }) {
  if (!sentence) return null;

  const { english, chinese, structure } = sentence;

  const segments = useMemo(() => {
    return parseColoredSegments(english, structure);
  }, [english, structure]);

  return (
    <div className="sentence-display">
      <p className="sentence-english">
        {segments.map((seg, i) => {
          if (seg.role) {
            return (
              <span key={i} className={`sentence-role sentence-role--${seg.role.toLowerCase()}`}>
                {seg.text}
                <sup className="sentence-role__label">{seg.role}</sup>
              </span>
            );
          }
          return <span key={i}>{seg.text}</span>;
        })}
      </p>
      {showChinese && (
        <p className="sentence-chinese">{chinese}</p>
      )}
      {structure && (
        <div className="sentence-legend">
          {structure.S && <span className="legend-item legend-s"><span className="legend-dot" /> S: {structure.S}</span>}
          {structure.V && <span className="legend-item legend-v"><span className="legend-dot" /> V: {structure.V}</span>}
          {structure.O && <span className="legend-item legend-o"><span className="legend-dot" /> O: {structure.O}</span>}
        </div>
      )}
    </div>
  );
}

/**
 * Parse a sentence structure into an array of { text, role } segments.
 * Handles overlapping/same-text roles by matching longest first.
 */
function parseColoredSegments(english, structure) {
  if (!structure) return [{ text: english, role: null }];

  const roleOrder = ['S', 'V', 'O', 'Adv', 'Adj', 'C'];
  const annotations = [];

  for (const role of roleOrder) {
    const text = structure[role];
    if (!text) continue;

    // Find the text in the English string, avoiding overlaps
    let searchFrom = 0;
    while (searchFrom < english.length) {
      const pos = english.indexOf(text, searchFrom);
      if (pos === -1) break;

      const end = pos + text.length;
      const overlaps = annotations.some(a =>
        pos < a.end && end > a.start
      );

      if (!overlaps) {
        annotations.push({ role, text, start: pos, end });
        break;
      }
      searchFrom = pos + 1;
    }
  }

  // Sort by position
  annotations.sort((a, b) => a.start - b.start);

  // Build segments
  const segments = [];
  let cursor = 0;
  for (const ann of annotations) {
    if (ann.start > cursor) {
      segments.push({ text: english.slice(cursor, ann.start), role: null });
    }
    segments.push({ text: ann.text, role: ann.role });
    cursor = ann.end;
  }
  if (cursor < english.length) {
    segments.push({ text: english.slice(cursor), role: null });
  }

  return segments.length > 0 ? segments : [{ text: english, role: null }];
}
