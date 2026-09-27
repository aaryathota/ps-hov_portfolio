import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import styles from './Select.module.css';

/*
  A dropdown that always opens directly under its own field.
  Replaces the native <select>, whose picker on iPhone was drawn in the wrong
  place (over another field) on this animated page.

  It submits like a normal field (a hidden input carries `name` and `value`),
  supports `required`, and works with the keyboard: arrows, Home/End,
  Enter/Space to choose, Escape to close.
*/
export default function Select({ id, name, value, onChange, options, placeholder = 'Select an option', required = false }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const listId = useId();

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => { if (!rootRef.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  const openList = () => { setActive(selectedIndex >= 0 ? selectedIndex : 0); setOpen(true); };
  const choose = (index) => {
    const option = options[index];
    if (!option) return;
    onChange?.(option.value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onKeyDown = (event) => {
    const last = options.length - 1;
    if (!open && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) { event.preventDefault(); openList(); return; }
    if (!open) return;
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive((i) => Math.min(last, i + 1)); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setActive((i) => Math.max(0, i - 1)); }
    else if (event.key === 'Home') { event.preventDefault(); setActive(0); }
    else if (event.key === 'End') { event.preventDefault(); setActive(last); }
    else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(active); }
    else if (event.key === 'Escape' || event.key === 'Tab') { setOpen(false); }
  };

  return (
    <div ref={rootRef} className={`${styles.root} ${open ? styles.open : ''}`}>
      <button
        ref={buttonRef}
        id={id}
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
      >
        <span className={selected ? styles.value : styles.placeholder}>{selected ? selected.label : placeholder}</span>
        <ChevronDown size={18} aria-hidden="true" className={styles.chevron} />
      </button>

      {/* Carries the value into the form, and lets the browser enforce `required` */}
      <input
        className={styles.proxy}
        tabIndex={-1}
        aria-hidden="true"
        name={name}
        value={value || ''}
        required={required}
        onChange={() => {}}
        onFocus={() => buttonRef.current?.focus()}
      />

      {open && (
        <ul id={listId} role="listbox" className={styles.list} aria-labelledby={id}>
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              className={`${styles.option} ${index === active ? styles.active : ''}`}
              onPointerEnter={() => setActive(index)}
              onClick={() => choose(index)}
            >
              <span>{option.label}</span>
              {option.value === value && <Check size={16} aria-hidden="true" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
