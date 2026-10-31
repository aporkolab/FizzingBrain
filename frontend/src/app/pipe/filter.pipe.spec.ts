import { FilterPipe } from './filter.pipe';

describe('FilterPipe', () => {
  const pipe = new FilterPipe<{ id: number; name: string; city: string }>();
  const list = [
    { id: 1, name: 'Ada', city: 'London' },
    { id: 2, name: 'Bálint', city: 'Budapest' },
  ];

  it('returns the list unchanged without a phrase', () => {
    expect(pipe.transform(list, '')).toBe(list);
    expect(pipe.transform(null, 'x')).toBeNull();
  });

  it('searches every field case-insensitively when no key is given', () => {
    expect(pipe.transform(list, 'BUDA')).toEqual([list[1]]);
  });

  it('searches only the given key', () => {
    expect(pipe.transform(list, 'ada', 'name')).toEqual([list[0]]);
    expect(pipe.transform(list, 'london', 'name')).toEqual([]);
  });
});
