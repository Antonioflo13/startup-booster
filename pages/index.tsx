//NEXT
import Head from "next/head";
//REACT
import { useEffect, useState } from "react";
//INTERFACES
import { MonthAverage } from "@/ts/interfaces/monthAverage";
import { IssuesResponse } from "@/ts/interfaces/issuesResponse";
import { PullsResponse } from "@/ts/interfaces/pullsReponse";
//TYPES
import { chartColumn } from "@/ts/types/chartColumn";
//GLOBAL FUNCTIONS
import {
  calculateAverageTime,
  convertMsToHour,
  convertTime,
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
export default function Home() {
  //STATE
  const [issues, setIssues] = useState([]);
  const [lastMonthIssues, setLastMonthIssues] = useState<IssuesResponse[]>([]);
  const [issuesAverage, setIssuesAverage] = useState("");
  const [pulls, setPulls] = useState<PullsResponse[]>([]);
  const [lastMonthPulls, setLastMonthPulls] = useState<PullsResponse[]>([]);
  const [pullsAverage, setPullsAverage] = useState("");
  const [lastMonthDays, setLastMonthDays] = useState<string[]>([]);
  const [lastMonthDaysWithH, setLastMonthDaysWithH] = useState<string[]>([]);
  const [monthAverage, setMonthAverage] = useState({});
  const [pullsSizeAverage, setPullsSizeAverage] = useState<chartColumn>([
    "",
    0,
    0,
    0,
  ]);
  const [pullsCounter, setPullsCounter] = useState<chartColumn>(["", 0, 0, 0]);

  const lastMonth = getLastMonth();
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
    if (!data.length) {
      pageNumber++;
      searchIssues(pageNumber++, state);
    }
    if (data.length) {
      switch (state) {
        case "all":
          setLastMonthIssues(data);
          break;
        case "closed":
          setIssues(data);
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
      if (!data.length) {
        pageNumber++;
        searchPulls(pageNumber++, state);
      }
      if (data.length) {
        switch (state) {
          case "all":
            setLastMonthPulls(data);
            break;
          case "closed":
            setPulls(data);
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
    let arrDays: { format: Function }[] = [];
    let arrDaysFormatted: string[] = [];
    let arrDaysFormattedWithH: string[] = [];

    while (daysInMonth) {
      const current = moment(lastMonth).date(daysInMonth);
      arrDays.push(current);
      daysInMonth--;
    }
    arrDays.forEach((item) => {
      arrDaysFormatted.push(item.format("DD-MM-YYYY"));
      arrDaysFormattedWithH.push(item.format("MM-DD-YYYY HH:MM"));
    });
    setLastMonthDays(arrDaysFormatted);
    setLastMonthDaysWithH(arrDaysFormattedWithH);
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
      smallAverageTime += created.getTime() - closed.getTime();
    }
    if (totalDiff > 100 && totalDiff <= 1000) {
      mediumPulls++;
      mediumAverageTime += created.getTime() - closed.getTime();
    }
    if (totalDiff > 1000) {
      largePulls++;
      largeAverageTime += created.getTime() - closed.getTime();
    }
    if (pullNumber === pulls.length) {
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
    setMonthAverage({ monthAverage, ...obj });
  };

  useEffect(() => {
    // searchIssues(1, "closed");
    // searchIssues(1, "all", lastMonth);
    searchPulls(1, "closed");
    // searchPulls(1, "all");
    getDaysArrayByMonth();
  }, []);

  useEffect(() => {
    setIssuesAverage(calculateAverageTime(issues));
  }, [issues]);

  useEffect(() => {
    setPullsAverage(calculateAverageTime(pulls));
    if (pulls) {
      for (const pull of pulls) {
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
          style={{ overflowY: "scroll" }}
          className="w-100 min-vh-100 bg-secondary"
        >
          <Navbar />
          <main className="pt-4 mx-4">
            <Card title={"Average Merge Time by Pull Request Size"}>
              <Chart
                type={"PullsSizeChart"}
                pullsSizeAverage={pullsSizeAverage}
                pullsCounter={pullsCounter}
              />
            </Card>
            <section className="d-flex justify-content-between">
              <Card title={"Average Pull request Merge Time"}>
                <div>{pullsAverage}</div>
              </Card>
              <Card title={"Average Issue Close Time"}>
                <div>{issuesAverage}</div>
              </Card>
            </section>
            <Card
              title={"Month Summary"}
              tabs={true}
              monthAverage={monthAverage}
              lastMonthDays={lastMonthDaysWithH}
            />
          </main>
        </div>
      </div>
    </>
  );
}
