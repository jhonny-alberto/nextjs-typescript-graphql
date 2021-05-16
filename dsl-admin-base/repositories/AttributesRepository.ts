export interface DslAttribute {
  id: number;
  name: string;
  position: number;
  category: string;
  display: string;
  status: string;
}

export default {
  async get(): Promise<DslAttribute[] | null> {
    const total = 12;
    const baseInfo = {
      id: 11000,
      name: 'Brand Owner',
      position: 1,
      category: 'All Categories',
      display: 'Y',
    };
    const attributes: DslAttribute[] = Array(total)
      .fill(0)
      .map((_, idx) =>
        idx !== 3
          ? {
              ...baseInfo,
              id: baseInfo.id + idx,
              status: 'A',
            }
          : {
              ...baseInfo,
              id: baseInfo.id + idx,
              status: 'D',
            },
      );

    return attributes;
  },
};
