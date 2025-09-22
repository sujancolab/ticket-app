import { reactive } from 'vue';

export const useTicketService = () => {
  // Mock data - in a real app, this would make API calls
  let tickets = reactive([
    {
      id: 1,
      title: 'Login page not working',
      description: 'Unable to login with correct credentials',
      status: 'Open',
      priority: 'High',
      category: 'Technical',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Invoice incorrect',
      description: 'The amount on the invoice doesn\'t match the order',
      status: 'In Progress',
      priority: 'Medium',
      category: 'Billing',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 3,
      title: 'Feature request',
      description: 'Add export to PDF functionality',
      status: 'Resolved',
      priority: 'Low',
      category: 'Sales',
      createdAt: new Date(Date.now() - 172800000).toISOString()
    }
  ]);
  
  const getTickets = async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...tickets]), 500);
    });
  };
  
  const getStatistics = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          open: tickets.filter(t => t.status === 'Open').length,
          inProgress: tickets.filter(t => t.status === 'In Progress').length,
          resolved: tickets.filter(t => t.status === 'Resolved').length
        });
      }, 300);
    });
  };
  
  const createTicket = async (ticketData: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTicket = {
          id: Math.max(...tickets.map(t => t.id)) + 1,
          ...ticketData,
          createdAt: new Date().toISOString()
        };
        tickets.push(newTicket);
        resolve(newTicket);
      }, 500);
    });
  };
  
  return { getTickets, getStatistics, createTicket };
};