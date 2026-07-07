import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileFormSchema } from '../utils/validationSchemas.js';
import { updateProfile } from '../services/profileApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useAccessibility } from '../context/AccessibilityContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { AGE_GROUPS, INCOME_RANGES, USER_CATEGORIES, INDIAN_STATES } from '../data/constants.js';
import FormField, { inputClasses } from '../components/FormField.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import AccessibilityControls from '../components/AccessibilityControls.jsx';
import LanguageSelector from '../components/LanguageSelector.jsx';

const ProfilePage = () => {
  const { user, updateUserLocal } = useAuth();
  const { highContrast, fontScale } = useAccessibility();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      state: user?.state || '',
      ageGroup: user?.ageGroup || '',
      occupation: user?.occupation || '',
      incomeRange: user?.incomeRange || '',
      category: user?.category || 'other',
      preferredLanguage: user?.preferredLanguage || 'en',
    },
  });

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const res = await updateProfile(values);
      updateUserLocal(res.data.user);
      showToast('Profile updated successfully.', 'success');
    } catch (err) {
      showToast(err.message || 'Could not update profile.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile & Accessibility Settings</h1>
        <p className="text-gray-600 mt-1">
          Keep your profile updated for better scheme recommendations.
        </p>
      </div>

      <Card className="p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Accessibility</h2>
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Font size</p>
            <AccessibilityControls />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Language</p>
            <LanguageSelector />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Current: font scale {fontScale.toFixed(2)}x, high contrast {highContrast ? 'on' : 'off'}.
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Personal Details</h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField label="Full Name" htmlFor="fullName" error={errors.fullName?.message}>
            <input id="fullName" type="text" className={inputClasses(errors.fullName)} {...register('fullName')} />
          </FormField>

          <FormField label="Phone Number" htmlFor="phone" error={errors.phone?.message}>
            <input id="phone" type="tel" className={inputClasses(errors.phone)} {...register('phone')} />
          </FormField>

          <FormField label="State" htmlFor="state" error={errors.state?.message}>
            <select id="state" className={inputClasses(errors.state)} {...register('state')}>
              <option value="">Select state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </FormField>

          <div className="grid sm:grid-cols-2 gap-x-4">
            <FormField label="Age Group" htmlFor="ageGroup" error={errors.ageGroup?.message}>
              <select id="ageGroup" className={inputClasses(errors.ageGroup)} {...register('ageGroup')}>
                <option value="">Select age group</option>
                {AGE_GROUPS.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Category" htmlFor="category" error={errors.category?.message}>
              <select id="category" className={inputClasses(errors.category)} {...register('category')}>
                {USER_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-4">
            <FormField label="Occupation" htmlFor="occupation" error={errors.occupation?.message}>
              <input id="occupation" type="text" className={inputClasses(errors.occupation)} {...register('occupation')} />
            </FormField>

            <FormField label="Income Range" htmlFor="incomeRange" error={errors.incomeRange?.message}>
              <select id="incomeRange" className={inputClasses(errors.incomeRange)} {...register('incomeRange')}>
                <option value="">Select income range</option>
                {INCOME_RANGES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <Button type="submit" loading={submitting} className="mt-2">
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ProfilePage;
