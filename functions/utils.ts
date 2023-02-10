let monthlyIssues: { [key: number]: unknown }[] = [];
let timeDiff: number = 0;
let totalCount: number = 0;

// SET LAST MONTH
export const getLastMonth = (): string => {
  const today = new Date();
  today.setMonth(today.getMonth() - 1);
  return today.toISOString().split(".")[0] + "Z";
};

// SET HUMAN ELAPSED TIME
export const convertTime = (time: number) => {
  let d, h, m, s;
  s = Math.floor(time / 1000);
  m = Math.floor(s / 60);
  s = s % 60;
  h = Math.floor(m / 60);
  m = m % 60;
  d = Math.floor(h / 24);
  h = h % 24;
  return d + " days, " + h + " hours, " + m + " minutes, " + s + " seconds.";
};

export const checkData = (
  responseData: {
    [key: number]: any;
    created_at: string;
    closed_at: string;
  }[]
) => {
  if (responseData.length) {
    for (const data of responseData) {
      const created = new Date(data.created_at);
      const closed = new Date(data.closed_at);
      timeDiff += closed.getTime() - created.getTime();
    }
    totalCount += responseData.length;
    monthlyIssues = [...monthlyIssues, ...responseData];
    return false;
  }
  if (!responseData.length) {
    const average = convertTime(timeDiff);
    const total = totalCount;
    totalCount = 0;
    timeDiff = 0;
    return { average, total };
  }
};
