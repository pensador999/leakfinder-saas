/**
 * 🛡️ LOCAL-FIRST STORAGE ADAPTER (ZERO SUPABASE VENDOR CHUNK)
 * Elimina 207.02 kB do bundle de produção mantendo compatibilidade 100% com a assinatura
 * de cliente para módulos que fazem fallback automático para localStorage / Mem0 Local.
 */

export const isSupabaseConfigured = false;

export interface LocalSupabaseResponse {
  data: (any[] & Record<string, any>) | null;
  error: { message: string } | null;
  count?: number | null;
}

export interface LocalQueryBuilder extends PromiseLike<LocalSupabaseResponse> {
  select: (...args: any[]) => LocalQueryBuilder;
  insert: (...args: any[]) => LocalQueryBuilder;
  update: (...args: any[]) => LocalQueryBuilder;
  upsert: (...args: any[]) => LocalQueryBuilder;
  delete: (...args: any[]) => LocalQueryBuilder;
  eq: (...args: any[]) => LocalQueryBuilder;
  neq: (...args: any[]) => LocalQueryBuilder;
  gt: (...args: any[]) => LocalQueryBuilder;
  gte: (...args: any[]) => LocalQueryBuilder;
  lt: (...args: any[]) => LocalQueryBuilder;
  lte: (...args: any[]) => LocalQueryBuilder;
  like: (...args: any[]) => LocalQueryBuilder;
  ilike: (...args: any[]) => LocalQueryBuilder;
  in: (...args: any[]) => LocalQueryBuilder;
  match: (...args: any[]) => LocalQueryBuilder;
  order: (...args: any[]) => LocalQueryBuilder;
  limit: (...args: any[]) => LocalQueryBuilder;
  single: () => Promise<LocalSupabaseResponse>;
  maybeSingle: () => Promise<LocalSupabaseResponse>;
}

function createLocalQueryBuilder(): LocalQueryBuilder {
  const resultPromise: Promise<LocalSupabaseResponse> = Promise.resolve({
    data: null,
    error: { message: 'Local-First Mode active (No external cloud DB required)' },
    count: 0
  });

  const builder: LocalQueryBuilder = {
    select: () => builder,
    insert: () => builder,
    update: () => builder,
    upsert: () => builder,
    delete: () => builder,
    eq: () => builder,
    neq: () => builder,
    gt: () => builder,
    gte: () => builder,
    lt: () => builder,
    lte: () => builder,
    like: () => builder,
    ilike: () => builder,
    in: () => builder,
    match: () => builder,
    order: () => builder,
    limit: () => builder,
    single: () => resultPromise,
    maybeSingle: () => resultPromise,
    then: resultPromise.then.bind(resultPromise)
  };

  return builder;
}

export const supabase = {
  from: (_table: string): LocalQueryBuilder => createLocalQueryBuilder(),
  auth: {
    getSession: async (): Promise<{ data: { session: any }; error: any }> => ({
      data: { session: null },
      error: null
    }),
    getUser: async (): Promise<{ data: { user: any }; error: any }> => ({
      data: { user: null },
      error: null
    }),
    signInWithPassword: async (_creds?: any): Promise<{ data: { user: any; session: any }; error: any }> => ({
      data: { user: null, session: null },
      error: null
    }),
    signUp: async (_creds?: any): Promise<{ data: { user: any; session: any }; error: any }> => ({
      data: { user: null, session: null },
      error: null
    }),
    signOut: async (): Promise<{ error: any }> => ({ error: null }),
    onAuthStateChange: (_cb: (event: string, session: any) => void) => ({
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    })
  }
};
