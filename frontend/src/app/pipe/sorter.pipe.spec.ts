import { SorterPipe } from './sorter.pipe';

describe('SorterPipe', () => {
  const pipe = new SorterPipe();

  it('passes through null and an empty key', () => {
    expect(pipe.transform(null, 'id')).toBeNull();
    const list = [{ id: 2 }, { id: 1 }];
    expect(pipe.transform(list, '')).toBe(list);
  });

  it('sorts numbers in both directions', () => {
    const list = [{ id: 2 }, { id: 10 }, { id: 1 }];
    expect(pipe.transform(list, 'id')!.map((x) => x.id)).toEqual([1, 2, 10]);
    expect(pipe.transform(list, 'id', -1)!.map((x) => x.id)).toEqual([10, 2, 1]);
  });

  it('sorts strings case-insensitively', () => {
    const list = [{ name: 'bravo' }, { name: 'Alpha' }, { name: 'charlie' }];
    expect(pipe.transform(list, 'name')!.map((x) => x.name)).toEqual(['Alpha', 'bravo', 'charlie']);
  });

  it('does not reorder the input array', () => {
    const list = [{ id: 3 }, { id: 1 }, { id: 2 }];
    pipe.transform(list, 'id');
    expect(list.map((x) => x.id)).toEqual([3, 1, 2]);
  });
});
