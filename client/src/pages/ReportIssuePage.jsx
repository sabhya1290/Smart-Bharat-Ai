import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, CheckCircle2 } from 'lucide-react';
import { reportIssueFormSchema } from '../utils/validationSchemas.js';
import { createIssue } from '../services/issuesApi.js';
import { useToast } from '../context/ToastContext.jsx';
import { ISSUE_CATEGORIES, PRIORITY_LEVELS } from '../data/constants.js';
import FormField, { inputClasses } from '../components/FormField.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';

const ReportIssuePage = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reportIssueFormSchema),
    defaultValues: { priority: 'medium' },
  });

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      if (imageFile) formData.append('image', imageFile);

      const res = await createIssue(formData);
      setConfirmation(res.data);
      showToast('Issue reported successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to submit issue. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmation) {
    return (
      <div className="max-w-lg">
        <Card className="p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-brand-green-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={28} className="text-brand-green-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Issue Reported Successfully</h1>
          <p className="text-gray-600 mt-2">
            Your complaint has been registered and assigned to the {confirmation.department}.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mt-5">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Your Complaint ID</p>
            <p className="text-2xl font-bold text-brand-blue-700 mt-1">{confirmation.complaintId}</p>
          </div>
          <div className="flex gap-3 justify-center mt-6">
            <Button onClick={() => navigate(`/complaint-tracker?id=${confirmation.complaintId}`)}>
              Track This Complaint
            </Button>
            <Button variant="secondary" onClick={() => navigate('/my-complaints')}>
              View My Complaints
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Report a Civic Issue</h1>
      <p className="text-gray-600 mt-1">
        Describe the problem and we'll route it to the right department and give you a trackable
        complaint ID.
      </p>

      <Card className="p-6 mt-6">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField label="Category" htmlFor="category" error={errors.category?.message}>
            <select id="category" className={inputClasses(errors.category)} {...register('category')}>
              <option value="">Select a category</option>
              {ISSUE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Description" htmlFor="description" error={errors.description?.message}>
            <textarea
              id="description"
              rows={4}
              className={inputClasses(errors.description)}
              placeholder="Describe the issue in detail..."
              {...register('description')}
            />
          </FormField>

          <div className="grid sm:grid-cols-2 gap-x-4">
            <FormField label="Address" htmlFor="address" error={errors.address?.message}>
              <input id="address" type="text" className={inputClasses(errors.address)} {...register('address')} />
            </FormField>
            <FormField label="Landmark (optional)" htmlFor="landmark" error={errors.landmark?.message}>
              <input id="landmark" type="text" className={inputClasses(errors.landmark)} {...register('landmark')} />
            </FormField>
          </div>

          <div className="grid sm:grid-cols-3 gap-x-4">
            <FormField label="City" htmlFor="city" error={errors.city?.message}>
              <input id="city" type="text" className={inputClasses(errors.city)} {...register('city')} />
            </FormField>
            <FormField label="State" htmlFor="state" error={errors.state?.message}>
              <input id="state" type="text" className={inputClasses(errors.state)} {...register('state')} />
            </FormField>
            <FormField label="Pincode" htmlFor="pincode" error={errors.pincode?.message}>
              <input id="pincode" type="text" maxLength={6} className={inputClasses(errors.pincode)} {...register('pincode')} />
            </FormField>
          </div>

          <FormField label="Priority" htmlFor="priority" error={errors.priority?.message}>
            <select id="priority" className={inputClasses(errors.priority)} {...register('priority')}>
              {PRIORITY_LEVELS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Photo (optional)" htmlFor="image">
            <label className="flex items-center gap-2 border border-dashed border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:border-brand-blue-300">
              <ImagePlus size={18} className="text-gray-400" />
              <span className="text-sm text-gray-500">
                {imageFile ? imageFile.name : 'Click to upload an image (JPEG/PNG/WEBP, max 5MB)'}
              </span>
              <input
                id="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </label>
          </FormField>

          <Button type="submit" className="w-full mt-2" loading={submitting}>
            Submit Report
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ReportIssuePage;
