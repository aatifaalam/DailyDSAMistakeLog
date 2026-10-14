import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MistakeForm from '../components/MistakeForm';
import { MistakeService } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';

const EditMistakePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [initialData, setInitialData] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);

  useEffect(() => {
    const fetchMistake = async () => {
      try {
        setFetching(true);
        const data = await MistakeService.getMistakeById(id);
        setInitialData(data);
      } catch (err) {
        showToast({ message: err.message, type: 'error' });
        navigate('/mistakes');
      } finally {
        setFetching(false);
      }
    };

    fetchMistake();
  }, [id, navigate, showToast]);

  const handleUpdateMistake = async (formData) => {
    try {
      setUpdating(true);
      setServerErrors(null);
      const updated = await MistakeService.updateMistake(id, formData);
      showToast({ 
        message: `Mistake for "${updated.problemName}" updated successfully!`, 
        type: 'success' 
      });
      navigate(`/mistakes/${id}`);
    } catch (err) {
      if (err.validationErrors) {
        setServerErrors(err.validationErrors);
        showToast({ message: 'Please fix the highlighted validation errors.', type: 'error' });
      } else {
        setServerErrors({ _general: err.message });
        showToast({ message: err.message, type: 'error' });
      }
    } finally {
      setUpdating(false);
    }
  };

  if (fetching) {
    return <LoadingSpinner text="Fetching mistake record for editing..." />;
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="h4 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          Edit Mistake Record
        </h2>
        <p className="text-muted mb-0 small">
          Update problem retrospective details, correct approach, or review status.
        </p>
      </div>

      <MistakeForm
        initialData={initialData}
        onSubmit={handleUpdateMistake}
        isLoading={updating}
        serverErrors={serverErrors}
        isEdit={true}
      />
    </div>
  );
};

export default EditMistakePage;
