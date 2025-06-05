import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ResponsiveLayout from '@/components/global/responsive-layout';
import IngameMain from '@/components/ingame/main';
import { getDiscordAvatarUrl } from '@/lib/auth';
import { User } from '@/types';

interface PageProps {
  params: Promise<{
    companyId: string;
  }>;
}

export default async function IngamePage({ params }: PageProps) {
  const { companyId } = await params;
  
  // Vérifier que l'ID de la compagnie est valide
  const companyIdNum = parseInt(companyId);
  if (isNaN(companyIdNum)) {
    notFound();
  }

  // Récupérer un employé actif de cette compagnie et son utilisateur
  const employee = await prisma.employees.findFirst({
    where: {
      company_id: companyIdNum,
      in_service: true,
      User: {
        some: {} // S'assurer qu'il y a au moins un utilisateur lié
      }
    },
    include: {
      User: {
        take: 1 // Prendre seulement le premier utilisateur
      },
      companies: true,
      grades: true
    }
  });

  if (!employee || !employee.User || employee.User.length === 0) {
    notFound();
  }

  const userData = employee.User[0];

  // Formater les données utilisateur pour correspondre au type User
  const user: User = {
    id: userData.id,
    username: userData.username,
    avatar: getDiscordAvatarUrl(userData.discord_user_id || '', userData.discord_avatar_hash),
    active_employee_id: userData.active_employee_id,
    discord_user_id: userData.discord_user_id || '',
    discord_avatar_hash: userData.discord_avatar_hash || '',
    employee: {
      id: employee.id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      name: `${employee.first_name} ${employee.last_name}`,
      character_id: employee.character_id,
      grade: employee.grade,
      salary: employee.grades?.salary || 0,
      in_service: employee.in_service,
      phone: employee.phone,
      iban: employee.iban,
      eotw_count: employee.eotw_count,
      time_in_service: employee.time_in_service,
      avatar: getDiscordAvatarUrl(userData.discord_user_id || '', userData.discord_avatar_hash),
      grades: {
        name: employee.grades?.name || '',
        salary: employee.grades?.salary || 0
      }
    },
    company: {
      id: employee.companies.id,
      name: employee.companies.name,
      type: employee.companies.type,
      logo: employee.companies.logo || '',
      created_at: employee.companies.created_at.toISOString()
    }
  };

  return (
    <ResponsiveLayout user={user} ingame={true}>
      <IngameMain user={user} />
    </ResponsiveLayout>
  );
} 