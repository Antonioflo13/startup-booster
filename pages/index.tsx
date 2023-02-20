//NEXT
import Head from "next/head";
//REACT
import { useEffect, useState } from "react";
//INTERFACES
import { issues, MonthAverage, pulls } from "@/ts/interfaces/monthAverage";
import { IssuesResponse } from "@/ts/interfaces/issuesResponse";
import { PullsResponse } from "@/ts/interfaces/pullsReponse";
//TYPES
import { chartJSData, chartData } from "@/ts/types/chartColumn";
//GLOBAL FUNCTIONS
import {
  calculateAverageTime,
  convertMsToHour,
  getLastMonth,
} from "@/functions/utils";
import { gitHubRequest } from "@/functions/gitHubRequest";
//MOMENT
import moment from "moment";
//COMPONENTS
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/NavBar";
import Chart from "@/components/Chart";
import Card from "@/components/Card";
import PullsSizeChartJS from "@/components/PullsSizeChartJS";
import ClayProgressBar from "@clayui/progress-bar";
export default function Home() {
  //STATE
  //ISSUES
  const [issues, setIssues] = useState<IssuesResponse[]>([]);
  const [lastMonthIssues, setLastMonthIssues] = useState<IssuesResponse[]>([]);
  const [issuesAverage, setIssuesAverage] = useState("");
  //PULLS
  const [pulls, setPulls] = useState<PullsResponse[]>([]);
  const [lastMonthPulls, setLastMonthPulls] = useState<PullsResponse[]>([]);
  const [pullsAverage, setPullsAverage] = useState("");
  //DAYS
  const [lastMonthDays, setLastMonthDays] = useState<string[]>([]);
  const [lastMonthDaysWithH, setLastMonthDaysWithH] = useState<string[]>([]);
  const [lastMonthDaysWithMonth, setLastMonthDaysWithMonth] = useState<
    string[]
  >([]);
  //MONTH
  const [monthIssuesAverage, setMonthIssuesAverage] = useState<issues>({
    opened: [],
    closed: [],
  });
  const [monthPullsAverage, setMonthPullsAverage] = useState<pulls>({
    opened: [],
    closed: [],
    merged: [],
  });

  const [pullsSizeAverage, setPullsSizeAverage] = useState<chartData>([
    "",
    0,
    0,
    0,
  ]);
  const [pullsSizeAverageJS, setPullsSizeAverageJS] = useState<chartJSData>([
    { type: "small", count: 0 },
    { type: "medium", count: 0 },
    { type: "large", count: 0 },
  ]);
  const [pullsCounter, setPullsCounter] = useState<chartData>(["", 0, 0, 0]);
  const [pullsCounterJS, setPullsCounterJS] = useState<chartJSData>([
    { type: "small", count: 0 },
    { type: "medium", count: 0 },
    { type: "large", count: 0 },
  ]);

  const lastMonth = getLastMonth();
  let issuesList: IssuesResponse[] = [];
  let lastMonthIssuesList: IssuesResponse[] = [];
  let pullsList: PullsResponse[] = [];
  let lastMonthPullsList: PullsResponse[] = [];
  let smallAverageTime = 0;
  let smallPulls = 0;
  let mediumAverageTime = 0;
  let mediumPulls = 0;
  let largeAverageTime = 0;
  let largePulls = 0;

  //LOADING STATE
  const [loadingPullSizesChart, setLoadingPullSizesChart] = useState<number>(0);
  const [loadingPullMonth, setLoadingPullMonth] = useState<number>(0);
  const [loadingIssuesMonth, setLoadingIssuesMonth] = useState<number>(0);
  const [loadingIssues, setLoadingIssues] = useState<number>(0);

  //ERROR HANDLER
  const [repoError, setRepoError] = useState(true);

  //FUNCTIONS

  //ISSUES
  const searchIssues = async (
    pageNumber: number,
    state?: string,
    lastMonth?: string
  ) => {
    try {
      const { status, data } = await gitHubRequest(
        "GET /repos/{owner}/{repo}/issues",
        state,
        pageNumber,
        lastMonth
      );
      if (status === 200 && data.length) {
        setRepoError(false);
        switch (state) {
          case "all":
            setLoadingIssuesMonth((oldValue) => oldValue + 1);
            lastMonthIssuesList = [...lastMonthIssuesList, ...data];
            break;
          case "closed":
            setLoadingIssues((oldValue) => oldValue + 1);
            issuesList = [...issuesList, ...data];
            break;
        }
        pageNumber++;
        searchIssues(pageNumber++, state);
      }
      if (!data.length) {
        setLoadingIssues(100);
        setLoadingIssuesMonth((oldValue) => oldValue + 1);
        switch (state) {
          case "all":
            setLastMonthIssues(lastMonthIssuesList);
            lastMonthIssuesList = [];
            break;
          case "closed":
            setIssues(issuesList);
            issuesList = [];
            break;
        }
      }
    } catch (e) {
      if (e.message === "Not found") {
        setRepoError(true);
      }
      console.log(e);
    }
  };

  //PULLS
  const searchPulls = async (pageNumber: number, state?: string) => {
    try {
      const { status, data } = await gitHubRequest(
        "GET /repos/{owner}/{repo}/pulls",
        state,
        pageNumber
      );
      if (status === 200 && data.length) {
        setRepoError(false);
        switch (state) {
          case "all":
            lastMonthPullsList = [...lastMonthPullsList, ...data];
            break;
          case "closed":
            pullsList = [...pullsList, ...data];
            break;
        }
        pageNumber++;
        setLoadingPullSizesChart((oldValue) => oldValue + 1);
        setLoadingPullMonth((oldValue) => oldValue + 1);
        searchPulls(pageNumber++, state);
      }
      if (!data.length) {
        setLoadingPullSizesChart((oldValue) => oldValue + 1);
        setLoadingPullMonth((oldValue) => oldValue + 1);
        switch (state) {
          case "all":
            setLastMonthPulls(lastMonthPullsList);
            lastMonthPullsList = [];
            break;
          case "closed":
            setPulls(pullsList);
            pullsList = [];
            break;
        }
      }
    } catch (e) {
      if (e.message === "Not found") {
        setRepoError(true);
      }
      console.log(e);
    }
  };

  const getPull = async (state?: string, number?: number, index?: number) => {
    try {
      const { status, data } = await gitHubRequest(
        `GET /repos/{owner}/{repo}/pulls/${number}`,
        state
      );
      if (status === 200) {
        calculateAveragePullsSize(
          data.number,
          index,
          data.deletions,
          data.additions,
          data.merged_at,
          data.created_at
        );
      }
    } catch (e) {
      if (e.message === "Not found") {
        setRepoError(true);
      }
      console.log(e);
    }
  };

  //GET DAYS OF LAST MONTH
  const getDaysArrayByMonth = () => {
    let daysInMonth = moment(lastMonth).daysInMonth();
    let day = moment().subtract(30, "day");
    let arrDays: { format: Function }[] = [];
    let arrDaysFormatted: string[] = [];
    let arrDaysFormattedWithH: string[] = [];
    let arrDaysFormattedWithMonth: string[] = [];

    while (daysInMonth) {
      day = moment(day).add(1, "day");
      const current = moment(day);
      arrDays.push(current);
      daysInMonth--;
    }
    arrDays.forEach((item) => {
      arrDaysFormatted.push(item.format("DD-MM-YYYY"));
      arrDaysFormattedWithH.push(item.format("MM-DD-YYYY HH:MM"));
      arrDaysFormattedWithMonth.push(item.format("DD MMM"));
    });
    setLastMonthDays(arrDaysFormatted);
    setLastMonthDaysWithH(arrDaysFormattedWithH);
    setLastMonthDaysWithMonth(arrDaysFormattedWithMonth);
  };

  //CALCULATE AVERAGE PULLS BY SIZES
  const calculateAveragePullsSize = (
    pullNumber: number,
    index: number | undefined,
    deletions: number,
    additions: number,
    mergedDate: string,
    createdDate: string
  ) => {
    const totalDiff = deletions + additions;
    const created = new Date(mergedDate);
    const closed = new Date(createdDate);
    if (totalDiff <= 100) {
      smallPulls++;
      smallAverageTime += Math.abs(created.getTime() - closed.getTime());
    }
    if (totalDiff > 100 && totalDiff <= 1000) {
      mediumPulls++;
      mediumAverageTime += Math.abs(created.getTime() - closed.getTime());
    }
    if (totalDiff > 1000) {
      largePulls++;
      largeAverageTime += Math.abs(created.getTime() - closed.getTime());
    }
    if (index) {
      const calculatingPercentage = ((index + 1) / pulls.length) * 100;
      setLoadingPullSizesChart(Math.round(calculatingPercentage));
    }
    if (pullNumber === pulls[pulls.length - 1].number) {
      smallAverageTime = smallAverageTime / pulls.length;
      smallAverageTime = convertMsToHour(smallAverageTime);
      mediumAverageTime = mediumAverageTime / pulls.length;
      mediumAverageTime = convertMsToHour(mediumAverageTime);
      largeAverageTime = largeAverageTime / pulls.length;
      largeAverageTime = convertMsToHour(largeAverageTime);
      setPullsSizeAverage([
        "Average Time",
        smallAverageTime,
        mediumAverageTime,
        largeAverageTime,
      ]);
      setPullsCounter(["Pull Request", smallPulls, mediumPulls, largePulls]);
      const pAverage = [
        { type: "small", count: smallAverageTime },
        { type: "medium", count: mediumAverageTime },
        { type: "large", count: largeAverageTime },
      ];
      setPullsSizeAverageJS(pAverage);
      const pCounter = [
        { type: "small", count: smallPulls },
        { type: "medium", count: mediumPulls },
        { type: "large", count: largePulls },
      ];
      setPullsCounterJS(pCounter);
    }
  };

  //CALCULATE MONTH AVERAGE
  const calculateMonthAverage = (type: string): void => {
    setLoadingPullMonth((oldValue) => oldValue + 1);
    setLoadingIssuesMonth((oldValue) => oldValue + 1);
    const obj: MonthAverage = {
      issues: {
        opened: [],
        closed: [],
      },
      pulls: {
        opened: [],
        closed: [],
        merged: [],
      },
    };
    switch (type) {
      case "issues":
        for (const [index, day] of lastMonthDays.entries()) {
          const calculatingPercentage =
            ((index + 1) / lastMonthDays.length) * 100;
          setLoadingIssuesMonth(Math.round(calculatingPercentage));
          let issueClosed = 0;
          let issueCreated = 0;
          for (const issue of lastMonthIssues) {
            if (moment(issue.closed_at).format("DD-MM-YYYY") === day) {
              issueClosed++;
              obj.issues.closed.push(issueClosed);
            }
            if (moment(issue.created_at).format("DD-MM-YYYY") === day) {
              issueCreated++;
              obj.issues.opened.push(issueCreated);
            }
          }
        }
        setMonthIssuesAverage({ ...monthIssuesAverage, ...obj.issues });
        break;
      case "pulls":
        for (const [index, day] of lastMonthDays.entries()) {
          const calculatingPercentage =
            ((index + 1) / lastMonthDays.length) * 100;
          setLoadingPullMonth(Math.round(calculatingPercentage));
          let pullClosed = 0;
          let pullCreated = 0;
          let pullMerged = 0;
          for (const pull of lastMonthPulls) {
            if (moment(pull.closed_at).format("DD-MM-YYYY") === day) {
              pullClosed++;
              obj.pulls.closed.push(pullClosed);
            }
            if (moment(pull.created_at).format("DD-MM-YYYY") === day) {
              pullCreated++;
              obj.pulls.opened.push(pullCreated);
            }
            if (moment(pull.merged_at).format("DD-MM-YYYY") === day) {
              pullMerged++;
              obj.pulls.merged.push(pullMerged);
            }
          }
        }
        setMonthPullsAverage({ ...monthPullsAverage, ...obj.pulls });
    }
  };

  useEffect(() => {
    searchIssues(1, "closed");
    searchIssues(1, "all", lastMonth);
    searchPulls(1, "closed");
    searchPulls(1, "all");
    getDaysArrayByMonth();
  }, []);

  useEffect(() => {
    setIssuesAverage(calculateAverageTime(issues));
  }, [issues]);

  useEffect(() => {
    setPullsAverage(calculateAverageTime(pulls));
    if (pulls) {
      for (const [index, pull] of pulls.entries()) {
        getPull("closed", pull.number, index);
      }
    }
  }, [pulls]);

  useEffect(() => {
    if (lastMonthIssues) {
      calculateMonthAverage("issues");
    }
    if (lastMonthPulls) {
      calculateMonthAverage("pulls");
    }
  }, [lastMonthIssues, lastMonthPulls]);

  return (
    <>
      <div className="d-flex vh-100 overflow-hidden">
        <Sidebar />
        <div
          style={{ overflowY: "scroll", backgroundColor: "#F1F2F5" }}
          className="w-100 min-vh-100"
        >
          <Navbar />
          <main className="pt-4 mx-4">
            {repoError ? (
              <div></div>
            ) : (
              <>
                <Card title={"Average Merge Time by Pull Request Size"}>
                  <Chart
                    type={"PullsSizeChartJS"}
                    loadingPullSizesChart={loadingPullSizesChart}
                    pullsSizeAverageJS={pullsSizeAverageJS}
                    pullsSizeAverage={pullsSizeAverage}
                    pullsCounter={pullsCounter}
                    pullsCounterJS={pullsCounterJS}
                  />
                </Card>
                <section className="d-grid">
                  <div className="row">
                    <div className="col-12 col-md-6 text-center">
                      <Card title={"Average Pull request Merge Time"}>
                        {loadingPullMonth >= 100 ? (
                          <div className="text-11">{pullsAverage}</div>
                        ) : (
                          <ClayProgressBar
                            value={
                              loadingPullSizesChart ? loadingPullSizesChart : 0
                            }
                          />
                        )}
                      </Card>
                    </div>
                    <div className="col-12 col-md-6 text-center">
                      <Card title={"Average Issue Close Time"}>
                        {loadingIssues >= 100 ? (
                          <div className="text-11">{issuesAverage}</div>
                        ) : (
                          <ClayProgressBar
                            value={loadingIssues ? loadingIssues : 0}
                          />
                        )}
                      </Card>
                    </div>
                  </div>
                </section>
                <Card
                  title={"Month Summary"}
                  tabs={true}
                  loadingPullMonth={loadingPullMonth}
                  loadingIssuesMonth={loadingIssuesMonth}
                  monthPullsAverage={monthPullsAverage}
                  monthIssuesAverage={monthIssuesAverage}
                  lastMonthDaysH={lastMonthDaysWithH}
                  lastMonthDaysM={lastMonthDaysWithMonth}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
