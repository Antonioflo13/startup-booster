//NEXT
import Head from "next/head";
//REACT
import { useEffect, useState } from "react";
//INTERFACES
import { MonthAverage } from "@/ts/interfaces/monthAverage";
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
export default function Home() {
  //STATE
  const [issues, setIssues] = useState<IssuesResponse[]>([]);
  const [lastMonthIssues, setLastMonthIssues] = useState<IssuesResponse[]>([]);
  const [issuesAverage, setIssuesAverage] = useState("");
  const [pulls, setPulls] = useState<PullsResponse[]>([]);
  const [lastMonthPulls, setLastMonthPulls] = useState<PullsResponse[]>([]);
  const [pullsAverage, setPullsAverage] = useState("");
  const [lastMonthDays, setLastMonthDays] = useState<string[]>([]);
  const [lastMonthDaysWithH, setLastMonthDaysWithH] = useState<string[]>([]);
  const [lastMonthDaysWithMonth, setLastMonthDaysWithMonth] = useState<
    string[]
  >([]);
  const [monthAverage, setMonthAverage] = useState<MonthAverage>({
    issues: {
      opened: [],
      closed: [],
    },
    pulls: {
      opened: [],
      closed: [],
      merged: [],
    },
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

  //FUNCTIONS

  //ISSUES
  const searchIssues = async (
    pageNumber: number,
    state?: string,
    lastMonth?: string
  ) => {
    const { status, data } = await gitHubRequest(
      "GET /repos/{owner}/{repo}/issues",
      state,
      pageNumber,
      lastMonth
    );
    if (data.length) {
      switch (state) {
        case "all":
          lastMonthIssuesList = [...lastMonthIssuesList, ...data];
          break;
        case "closed":
          issuesList = [...issuesList, ...data];
          break;
      }
      pageNumber++;
      searchIssues(pageNumber++, state);
    }
    if (!data.length) {
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
  };

  //PULLS
  const searchPulls = async (pageNumber: number, state?: string) => {
    try {
      const { status, data } = await gitHubRequest(
        "GET /repos/{owner}/{repo}/pulls",
        state,
        pageNumber
      );
      if (data.length) {
        switch (state) {
          case "all":
            lastMonthPullsList = [...lastMonthPullsList, ...data];
            break;
          case "closed":
            pullsList = [...pullsList, ...data];
            break;
        }
        pageNumber++;
        searchPulls(pageNumber++, state);
      }
      if (!data.length) {
        switch (state) {
          case "all":
            setLastMonthPulls(lastMonthPullsList);
            lastMonthPullsList = [];
            break;
          case "closed":
            setPulls(pullsList);
            console.log(pullsList[pullsList.length - 1].number);
            pullsList = [];
            break;
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getPull = async (state?: string, number?: number) => {
    try {
      const { status, data } = await gitHubRequest(
        `GET /repos/{owner}/{repo}/pulls/${number}`,
        state
      );
      calculateAveragePullsSize(
        data.number,
        data.deletions,
        data.additions,
        data.merged_at,
        data.created_at
      );
    } catch (e) {
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
  const calculateMonthAverage = () => {
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
    for (const day of lastMonthDays) {
      let issueClosed = 0;
      let issueCreated = 0;
      let pullClosed = 0;
      let pullCreated = 0;
      let pullMerged = 0;
      for (const issue of lastMonthIssues) {
        if (moment(issue.closed_at).format("DD-MM-YYYY") === day) {
          issueClosed++;
          obj.issues.closed.push(issueClosed);
          console.log(issueClosed, day);
        }
        if (moment(issue.created_at).format("DD-MM-YYYY") === day) {
          issueCreated++;
          obj.issues.opened.push(issueCreated);
        }
      }
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
    setMonthAverage({ ...monthAverage, ...obj });
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
      for (const pull of pulls) {
        console.log(pull);
        getPull("closed", pull.number);
      }
    }
  }, [pulls]);

  useEffect(() => {
    calculateMonthAverage();
  }, [lastMonthIssues]);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="d-flex vh-100 overflow-hidden">
        <Sidebar />
        <div
          style={{ overflowY: "scroll", backgroundColor: "#F1F2F5" }}
          className="w-100 min-vh-100"
        >
          <Navbar />
          <main className="pt-4 mx-4">
            <Card title={"Average Merge Time by Pull Request Size"}>
              <Chart
                type={"PullsSizeChartJS"}
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
                    <div className="text-11">{pullsAverage}</div>
                  </Card>
                </div>
                <div className="col-12 col-md-6 text-center">
                  <Card title={"Average Issue Close Time"}>
                    <div className="text-11">{issuesAverage}</div>
                  </Card>
                </div>
              </div>
            </section>
            <Card
              title={"Month Summary"}
              tabs={true}
              monthAverage={monthAverage}
              lastMonthDaysH={lastMonthDaysWithH}
              lastMonthDaysM={lastMonthDaysWithMonth}
            />
          </main>
        </div>
      </div>
    </>
  );
}
