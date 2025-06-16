import StudyDashboard from '@/components/pages/StudyDashboard';
import StudyCalendar from '@/components/pages/StudyCalendar';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'StudyLens',
    path: '/',
    component: StudyDashboard
  },
  calendar: {
    id: 'calendar',
    label: 'Study Calendar',
    path: '/calendar',
    component: StudyCalendar
  }
};

export const routeArray = Object.values(routes);
export default routes;