import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MistakeForm from '../components/MistakeForm';
import { MistakeService } from '../services/api';
import { useToast } from '../context/ToastContext';

const AddMistakePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);

  const handleCreateMistake = async (formData) => {
    try {
      setLoading(true);
      setServerErrors(null);
      const created = await MistakeService.createMistake(formData);
      showToast({ 
        message: `Mistake for "${created.problemName}" recorded successfully!`, 
        type: 'success' 
      });
      navigate(`/mistakes/${created.id}`);
    } catch (err) {
      if (err.validationErrors) {
        setServerErrors(err.validationErrors);
        showToast({ message: 'Please fix the highlighted validation errors.', type: 'error' });
      } else {
        setServerErrors({ _general: err.message });
        showToast({ message: err.message, type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-3">
        <h1 className="h4 fw-bold mb-1" style={{ color: 'var(--lc-text-primary)', letterSpacing: '-0.01em' }}>
          Record a DSA Mistake
        </h1>
        <p className="small mb-0" style={{ color: 'var(--lc-text-secondary)' }}>
          Document your initial intuition, analyze why it failed, and define what you will do differently next time.
        </p>
      </div>

      <MistakeForm
        onSubmit={handleCreateMistake}
        isLoading={loading}
        serverErrors={serverErrors}
        isEdit={false}
      />
    </div>
  );
};

export default AddMistakePage;
