import ClayCard from "@clayui/card";
import ClayTabs from "@clayui/tabs";
import { useState } from "react";
import Chart from "@/components/Chart";
import { issues, MonthAverage, pulls } from "@/ts/interfaces/monthAverage";

interface cardProps {
  title: string;
  tabs?: boolean;
  children?: JSX.Element;
  monthAverage?: MonthAverage;
  lastMonthDaysH?: string[];
  lastMonthDaysM?: string[];
}
const Card = ({
  title,
  tabs = false,
  children,
  monthAverage,
  lastMonthDaysH,
  lastMonthDaysM,
}: cardProps): JSX.Element => {
  const [active, setActive] = useState(0);
  return (
    <div>
      <ClayCard>
        <div className="px-4 pt-2">{title}</div>
        <div className="card-divider"></div>
        <ClayCard.Body>
          <ClayCard.Row>
            <div className="autofit-col autofit-col-expand">
              {tabs ? (
                <div className="px-2">
                  <ClayTabs active={active} modern onActiveChange={setActive}>
                    <ClayTabs.Item
                      innerProps={{
                        "aria-controls": "tabpanel-1",
                      }}
                    >
                      Pull Requests
                    </ClayTabs.Item>
                    <ClayTabs.Item
                      innerProps={{
                        "aria-controls": "tabpanel-2",
                      }}
                    >
                      Issues
                    </ClayTabs.Item>
                  </ClayTabs>
                  <ClayTabs.Content activeIndex={active} fade>
                    <ClayTabs.TabPane aria-labelledby="tab-1">
                      <Chart
                        type={"MonthChartJS"}
                        dataType={"pulls"}
                        monthAveragePulls={monthAverage?.pulls}
                        lastMonthDaysM={lastMonthDaysM}
                        lastMonthDaysH={lastMonthDaysH}
                      />
                    </ClayTabs.TabPane>
                    <ClayTabs.TabPane aria-labelledby="tab-2">
                      <Chart
                        type={"MonthChartJS"}
                        dataType={"issues"}
                        monthAverageIssues={monthAverage?.issues}
                        lastMonthDaysM={lastMonthDaysM}
                        lastMonthDaysH={lastMonthDaysH}
                      />
                    </ClayTabs.TabPane>
                  </ClayTabs.Content>
                </div>
              ) : (
                <section className="autofit-section">{children}</section>
              )}
            </div>
          </ClayCard.Row>
        </ClayCard.Body>
      </ClayCard>
    </div>
  );
};

export default Card;
