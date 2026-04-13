import { useState, useCallback } from 'react';

// ── Validators ──
export const rules = {
  required: (v) => (!v || !v.trim()) ? 'Bu maydon majburiy' : null,

  email: (v) => {
    if (!v) return 'Email majburiy';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "To'g'ri email kiriting";
    return null;
  },

  minLength: (n) => (v) =>
    v && v.length < n ? `Kamida ${n} ta belgi` : null,

  maxLength: (n) => (v) =>
    v && v.length > n ? `Ko'pi bilan ${n} ta belgi` : null,

  strongPassword: (v) => {
    if (!v) return 'Parol majburiy';
    if (v.length < 8) return 'Kamida 8 ta belgi';
    if (!/[A-Z]/.test(v)) return 'Kamida 1 ta katta harf (A-Z)';
    if (!/[0-9]/.test(v)) return 'Kamida 1 ta raqam';
    return null;
  },

  match: (fieldName, label) => (v, allValues) =>
    v !== allValues[fieldName] ? `${label} mos kelmadi` : null,
};

// ── Hook ──
export function useFormValidation(initialValues, validationRules) {
  const [values, setValues]   = useState(initialValues);
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});

  const validate = useCallback((vals = values) => {
    const newErrors = {};
    for (const field in validationRules) {
      const fieldRules = validationRules[field];
      for (const rule of fieldRules) {
        const error = rule(vals[field], vals);
        if (error) { newErrors[field] = error; break; }
      }
    }
    return newErrors;
  }, [values, validationRules]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    const newVals = { ...values, [name]: value };
    setValues(newVals);

    // Foydalanuvchi yoza boshlaganda real-time xato ko'rsat
    if (touched[name]) {
      const newErrors = {};
      const fieldRules = validationRules[name] || [];
      for (const rule of fieldRules) {
        const error = rule(value, newVals);
        if (error) { newErrors[name] = error; break; }
      }
      setErrors(prev => ({ ...prev, [name]: newErrors[name] || null }));
    }
  }, [values, touched, validationRules]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    const fieldRules = validationRules[name] || [];
    for (const rule of fieldRules) {
      const error = rule(value, values);
      if (error) {
        setErrors(prev => ({ ...prev, [name]: error }));
        return;
      }
    }
    setErrors(prev => ({ ...prev, [name]: null }));
  }, [values, validationRules]);

  const handleSubmit = useCallback((onSubmit) => async (e) => {
    e.preventDefault();
    // Hammasini touched qil
    const allTouched = Object.keys(validationRules).reduce(
      (acc, k) => ({ ...acc, [k]: true }), {}
    );
    setTouched(allTouched);

    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).filter(k => errs[k]).length === 0) {
      await onSubmit(values);
    }
  }, [validate, values, validationRules]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const isValid = Object.keys(validate()).filter(k => validate()[k]).length === 0;

  return { values, errors, touched, handleChange, handleBlur, handleSubmit, reset, isValid };
}
