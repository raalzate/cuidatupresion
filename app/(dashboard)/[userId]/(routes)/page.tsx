'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { DashboardClient } from './components/dashboard-client';
import { Patient } from '@prisma/client';
import { apiClient } from '@/services/api';

const DashboardPage = () => {
  const params = useParams();
  const userId = params?.userId;
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
       const patient = await apiClient.get<Patient>(`/users/${userId}`); 
        setPatient(patient);
      } catch (error) {
        console.error('Error fetching patient data:', error);
        // Manejar el error, por ejemplo, mostrando un mensaje al usuario
      }
    };

    if (userId) {
      fetchPatient();
    }
  }, [userId]);

  if (!patient) {
    return <div>Cargando...</div>; 
  }

  return <DashboardClient patient={patient} />;
};

export default DashboardPage;
