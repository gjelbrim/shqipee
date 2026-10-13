export const ScriptType = /** @type {const} */ ({
    ELBASAN: 'elbasan',
    VITHKUQI: 'vithkuqi',
    TODHRI: 'todhri'
  });

// 'elbasan' | 'vithkuqi' | 'todhri'
/** @typedef {typeof ScriptType[keyof typeof ScriptType]} Script */
