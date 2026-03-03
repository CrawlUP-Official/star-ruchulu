// Mock the database pool to prevent ANY real MySQL connections globally
jest.mock('../src/config/db', () => ({
    query: jest.fn().mockImplementation(async (q) => {
        if (q.includes('WHERE p.id = ?')) return [[{ id: 2, name: 'Gongura', weight: '250g', price: 150 }]];
        return [[], []];
    }),
    getConnection: jest.fn().mockResolvedValue({
        beginTransaction: jest.fn(),
        commit: jest.fn(),
        rollback: jest.fn(),
        query: jest.fn().mockResolvedValue([[{ insertId: 1, count: 0 }]]),
        release: jest.fn()
    }),
    end: jest.fn()
}));
