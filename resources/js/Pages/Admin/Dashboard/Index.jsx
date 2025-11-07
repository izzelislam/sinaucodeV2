import DashboardLayout from '../../../Layouts/DashboardLayout';
import HeroSection from '../../../Components/Dashboard/HeroSection';
import StatsGrid from '../../../Components/Dashboard/StatsGrid';
import VelocityOverview from '../../../Components/Dashboard/VelocityOverview';
import TeamLoadCard from '../../../Components/Dashboard/TeamLoadCard';
import TasksCard from '../../../Components/Dashboard/TasksCard';
import ScheduleCard from '../../../Components/Dashboard/ScheduleCard';
import AnnouncementsCard from '../../../Components/Dashboard/AnnouncementsCard';

export default function DashboardIndex() {
  return (
    <DashboardLayout>
      <HeroSection />
      <StatsGrid />

      <section className="grid gap-6 lg:grid-cols-3">
        <VelocityOverview />
        <TeamLoadCard />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <TasksCard />
        <ScheduleCard />
        <AnnouncementsCard />
      </section>
    </DashboardLayout>
  );
}
