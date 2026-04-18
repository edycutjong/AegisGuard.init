import { supabase, fetchActiveSessions, fetchRecentAlerts } from './supabase';

jest.mock('@supabase/supabase-js', () => {
  const mockSelect = jest.fn();
  const mockEq = jest.fn();
  const mockOrder = jest.fn();
  const mockLimit = jest.fn();

  const mockQueryBuilder = {
    select: mockSelect,
    eq: mockEq,
    order: mockOrder,
    limit: mockLimit,
  };

  mockSelect.mockReturnValue(mockQueryBuilder);
  mockEq.mockReturnValue(mockQueryBuilder);
  mockOrder.mockReturnValue(mockQueryBuilder);
  mockLimit.mockResolvedValue({ data: [], error: null });

  // For fetchActiveSessions
  mockOrder.mockImplementation(() => {
    // If it's part of fetchActiveSessions, the chain resolves
    return Promise.resolve({ data: [{ id: 1 }], error: null });
  });

  return {
    createClient: jest.fn(() => ({
      from: jest.fn(() => mockQueryBuilder)
    }))
  };
});

describe('supabase', () => {
  it('should export a pre-configured supabase client', () => {
    expect(supabase).toBeDefined();
    expect(typeof supabase.from).toBe('function');
  });

  it('fetchActiveSessions should return active sessions', async () => {
    const res = await fetchActiveSessions();
    expect(res).toBeDefined();
    expect(res.data).toBeInstanceOf(Array);
  });

  it('fetchRecentAlerts should return recent alerts', async () => {
    // Re-mock the order function specifically to resolve with limit for fetchRecentAlerts
    const qb = supabase.from('alerts').select();
    (qb.order as jest.Mock).mockImplementationOnce(() => ({
      limit: jest.fn().mockResolvedValue({ data: [{ id: 'alert1' }], error: null })
    }));
    
    const res = await fetchRecentAlerts(10);
    expect(res.data).toBeDefined();
  });

  it('fetchRecentAlerts should use default limit if not provided', async () => {
    const qb = supabase.from('alerts').select();
    const mockLimit = jest.fn().mockResolvedValue({ data: [{ id: 'alert2' }], error: null });
    (qb.order as jest.Mock).mockImplementationOnce(() => ({
      limit: mockLimit
    }));
    
    await fetchRecentAlerts();
    expect(mockLimit).toHaveBeenCalledWith(50);
  });
});
