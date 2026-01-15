import { supabase } from '../lib/supabase';

export interface PerformanceStats {
  leadsWorked: number;
  rdvTaken: number;
  sales: number;
  rdvRatio: number;
  signatureRate: number;
  fakeNumbersRate: number;
}

export interface UserPerformance {
  userId: string;
  name: string;
  leadsWorked: number;
  rdvTaken: number;
  signed: number;
}

export interface DailyChartData {
  date: string;
  value: number;
}

export async function getPerformanceStats(
  startDate: string,
  endDate: string,
  listName?: string
): Promise<PerformanceStats> {
  const startDateTime = new Date(startDate).toISOString();
  const endDateTime = new Date(endDate + 'T23:59:59').toISOString();

  let leadsQuery = supabase
    .from('leads')
    .select('id, status, is_fake_number', { count: 'exact' })
    .gte('worked_at', startDateTime)
    .lte('worked_at', endDateTime);

  if (listName && listName !== 'Toutes les listes') {
    leadsQuery = leadsQuery.eq('list_name', listName);
  }

  const { data: leads, count: totalLeadsWorked } = await leadsQuery;

  const rdvCount = leads?.filter(l => l.status === 'rdv_pris' || l.status === 'signé').length || 0;
  const salesCount = leads?.filter(l => l.status === 'signé').length || 0;
  const fakeNumbersCount = leads?.filter(l => l.is_fake_number).length || 0;

  const rdvRatio = totalLeadsWorked ? (rdvCount / totalLeadsWorked) * 100 : 0;
  const signatureRate = rdvCount > 0 ? (salesCount / rdvCount) * 100 : 0;
  const fakeNumbersRate = totalLeadsWorked ? (fakeNumbersCount / totalLeadsWorked) * 100 : 0;

  return {
    leadsWorked: totalLeadsWorked || 0,
    rdvTaken: rdvCount,
    sales: salesCount,
    rdvRatio: Math.round(rdvRatio * 10) / 10,
    signatureRate: Math.round(signatureRate * 10) / 10,
    fakeNumbersRate: Math.round(fakeNumbersRate * 10) / 10,
  };
}

export async function getUserPerformances(
  startDate: string,
  endDate: string,
  listName?: string,
  searchQuery?: string
): Promise<UserPerformance[]> {
  const startDateTime = new Date(startDate).toISOString();
  const endDateTime = new Date(endDate + 'T23:59:59').toISOString();

  const { data: userProfiles } = await supabase
    .from('user_profiles')
    .select('id, first_name, last_name')
    .eq('is_active', true);

  if (!userProfiles) return [];

  const performances: UserPerformance[] = [];

  for (const user of userProfiles) {
    const fullName = `${user.first_name} ${user.last_name}`;

    if (searchQuery && !fullName.toLowerCase().includes(searchQuery.toLowerCase())) {
      continue;
    }

    let leadsQuery = supabase
      .from('leads')
      .select('id, status')
      .eq('user_id', user.id)
      .gte('worked_at', startDateTime)
      .lte('worked_at', endDateTime);

    if (listName && listName !== 'Toutes les listes') {
      leadsQuery = leadsQuery.eq('list_name', listName);
    }

    const { data: leads } = await leadsQuery;

    const leadsWorked = leads?.length || 0;
    const rdvTaken = leads?.filter(l => l.status === 'rdv_pris' || l.status === 'signé').length || 0;
    const signed = leads?.filter(l => l.status === 'signé').length || 0;

    if (leadsWorked > 0 || rdvTaken > 0 || signed > 0) {
      performances.push({
        userId: user.id,
        name: fullName,
        leadsWorked,
        rdvTaken,
        signed,
      });
    }
  }

  return performances.sort((a, b) => b.leadsWorked - a.leadsWorked);
}

export async function getDailyLeadsData(
  startDate: string,
  endDate: string,
  listName?: string
): Promise<DailyChartData[]> {
  const startDateTime = new Date(startDate).toISOString();
  const endDateTime = new Date(endDate + 'T23:59:59').toISOString();

  let query = supabase
    .from('leads')
    .select('worked_at')
    .gte('worked_at', startDateTime)
    .lte('worked_at', endDateTime)
    .not('worked_at', 'is', null);

  if (listName && listName !== 'Toutes les listes') {
    query = query.eq('list_name', listName);
  }

  const { data: leads } = await query;

  const dateMap = new Map<string, number>();

  const start = new Date(startDate);
  const end = new Date(endDate);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateKey = d.toISOString().split('T')[0];
    dateMap.set(dateKey, 0);
  }

  leads?.forEach(lead => {
    if (lead.worked_at) {
      const dateKey = new Date(lead.worked_at).toISOString().split('T')[0];
      dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + 1);
    }
  });

  return Array.from(dateMap.entries()).map(([date, value]) => ({
    date,
    value,
  }));
}

export async function getDailyAppointmentsData(
  startDate: string,
  endDate: string,
  listName?: string
): Promise<DailyChartData[]> {
  const startDateTime = new Date(startDate).toISOString();
  const endDateTime = new Date(endDate + 'T23:59:59').toISOString();

  let query = supabase
    .from('appointments')
    .select('created_at, lead_id')
    .gte('created_at', startDateTime)
    .lte('created_at', endDateTime);

  if (listName && listName !== 'Toutes les listes') {
    const { data: leadsInList } = await supabase
      .from('leads')
      .select('id')
      .eq('list_name', listName);

    const leadIds = leadsInList?.map(l => l.id) || [];
    if (leadIds.length > 0) {
      query = query.in('lead_id', leadIds);
    } else {
      return [];
    }
  }

  const { data: appointments } = await query;

  const dateMap = new Map<string, number>();

  const start = new Date(startDate);
  const end = new Date(endDate);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateKey = d.toISOString().split('T')[0];
    dateMap.set(dateKey, 0);
  }

  appointments?.forEach(appointment => {
    if (appointment.created_at) {
      const dateKey = new Date(appointment.created_at).toISOString().split('T')[0];
      dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + 1);
    }
  });

  return Array.from(dateMap.entries()).map(([date, value]) => ({
    date,
    value,
  }));
}
