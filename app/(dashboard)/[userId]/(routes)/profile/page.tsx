"use client";

import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { apiClient } from "@/services/api";
import { EmptyState } from "@/components/shared/empty-state/empty-state";
import { maskValue } from "@/utils/mask-value";
import { ProfileForm } from "./components/profile-form";

import {
  Doctor,
  Medications,
  Patient,
  PatientMedications,
  PatientRelevantConditions,
  RelevantConditions,
} from "@prisma/client";

type PatientResponse = Patient & {
  doctor: Doctor;
  relevantConditions: (PatientRelevantConditions & {
    relevantCondition: RelevantConditions;
  })[];
  medications: (PatientMedications & { medication: Medications })[];
};

const SettingsPage = () => {
  const params = useParams();
  const userId = params?.userId;

  const [loading, setLoading] = useState<boolean>(true);
  const [patient, setPatient] = useState<PatientResponse | null>(null);
  const [medications, setMedications] = useState<Medications[]>([]);
  const [relevantConditions, setRelevantConditions] = useState<
    RelevantConditions[]
  >([]);

  useEffect(() => {
    const fetchRelevantConditions = async () => {
      try {
        setLoading(true);

        const data = await apiClient.get<RelevantConditions[]>(
          "/relevant-conditions"
        );

        setRelevantConditions(data);
      } catch (error) {
        toast.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchMedications = async () => {
      try {
        setLoading(true);

        const data = await apiClient.get<Medications[]>("/medications");

        setMedications(data);
      } catch (error) {
        toast.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchMedicalHistory = async () => {
      try {
        setLoading(true);

        const data = await apiClient.get<PatientResponse>(`/users/${userId}`);

        setPatient(data);
      } catch (error) {
        toast.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchMedicalHistory();
      fetchRelevantConditions();
      fetchMedications();
    }
  }, [userId]);

  const initialData = {
    name: patient?.name ?? "",
    email: patient?.email ?? "",
    birthdate: patient?.birthdate
      ? typeof patient.birthdate === "string"
        ? new Date(patient.birthdate)
        : patient.birthdate
      : new Date(),
    gender: patient?.gender ?? "",
    doctorAccessCode: maskValue(patient?.doctor?.accessCode ?? ""),
    height: patient?.height ?? 0,
    weight: patient?.weight ?? 0,
    relevantConditions:
      patient?.relevantConditions?.map((rc) => ({
        id: rc.relevantCondition.id,
        name: rc.relevantCondition.name,
      })) ?? [],
    medications:
      patient?.medications?.map((m) => ({
        id: m.medication.id,
        name: m.medication.name,
      })) ?? [],
  };

  if (loading || Object.keys(patient ?? {}).length === 0) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <EmptyState
            ctaHref={`/${userId}/history`}
            ctaLabel="Ver mis mediciones"
            subtitle="En breve podrás ver tus datos personales."
            title="Obteniendo tus datos"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProfileForm
          initialData={initialData}
          relevantConditions={relevantConditions}
          medications={medications}
        />
      </div>
    </div>
  );
};
export default SettingsPage;
