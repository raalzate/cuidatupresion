"use client";

import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { apiClient } from "@/services/api";
import { EmptyState } from "@/components/shared/empty-state/empty-state";
import { maskValue } from "@/utils/mask-value";
import { ProfileForm } from "./components/profile-form";

import prismadb from "@/lib/prismadb";

interface SettingsPageProps {
  params: Promise<{ userId: string }>;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ params }) => {
const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
  const { userId } = await params;

  const user = await prismadb.patient.findUnique({
    where: {
      id: userId,
    },
    include: {
      relevantConditions: {
        include: {
          relevantCondition: true,
        },
      },
      medications: {
        include: {
          medication: true,
        },
      },
      doctor: true,
    },
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const relevantConditions = await prismadb.relevantConditions.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const medications = await prismadb.medications.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const initialData = {
    relevantConditions: [],
    medications: [],
    name: "",
    email: "",
    birthdate: new Date(),
    gender: "",
    doctorAccessCode: "",
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
        <ProfileForm initialData={initialData} />
      </div>
    </div>
  );
};
export default SettingsPage;
