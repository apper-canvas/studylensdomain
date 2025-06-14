import StudyDashboard from '@/components/pages/StudyDashboard';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'StudyLens',
    path: '/',
    component: StudyDashboard
  }
};

export const routeArray = Object.values(routes);
export default routes;