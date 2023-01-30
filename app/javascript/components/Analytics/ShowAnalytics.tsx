import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  ThemeProvider,
  Divider,
} from "@material-ui/core";
import TimelineIcon from "@material-ui/icons/Timeline";
import React, { useEffect } from "react";
import { theme } from "../../theme";
import * as nv from "nvd3";
import * as d3 from "d3";
import Hero from "../../ui/hero";

function ShowAnalytics({
  className,
  percent_status,
  incident_count_by_month,
  down_count_by_hour,
  up_count_by_hour,
  distribution_by_tag,
  top_incident_by_tag,
  top_incidents,
}) {
  const navigate = (url: string) => {
    window.location.href = url;
  };

  useEffect(() => {
    var colors = ["green", "gray"];
    var testdata1 = [
      { key: "Up", y: percent_status[0] },
      { key: "Down", y: percent_status[1] },
    ];

    var sum = testdata1[0].y + testdata1[1].y;
    var arcRadius1 = [
      { inner: 0.7, outer: 1 },
      { inner: 0.7, outer: 1 },
    ];

    var height = 350;
    var width = 350;

    nv.addGraph(function () {
      var chart = nv.models
        .pieChart()
        .x(function (d) {
          return d.key;
        })
        .y(function (d) {
          return d.y;
        })
        .donut(true)
        .showLabels(false)
        .color(colors)
        .width(width)
        .height(height)
        .growOnHover(false)
        .arcsRadius(arcRadius1)
        .id("donut1"); // allow custom CSS for this one svg
      chart.title("0%");
      d3.select("#status")
        .datum(testdata1)
        .transition()
        .duration(1200)
        .attr("width", width)
        .attr("height", height)
        .call(chart);
      // update chart data values randomly
      chart.title(((testdata1[0].y * 100) / sum).toFixed(2) + "%");
      chart.update();
      return chart;
    });

    nv.addGraph(function () {
      var chart = nv.models
        .pieChart()
        .x(function (d) {
          return d.key;
        })
        .y(function (d) {
          return d.y;
        })
        .width(width)
        .height(height)
        .showTooltipPercent(true);
      d3.select("#topIncidents")
        .datum(top_incidents)
        .transition()
        .duration(1200)
        .attr("width", width)
        .attr("height", height)
        .call(chart);
      return chart;
    });

    nv.addGraph(function () {
      var chart = nv.models
        .pieChart()
        .x(function (d) {
          return d.key;
        })
        .y(function (d) {
          return d.y;
        })
        .width(width)
        .height(height)
        .showTooltipPercent(true);
      d3.select("#topIncidentByTag")
        .datum(top_incident_by_tag)
        .transition()
        .duration(1200)
        .attr("width", width)
        .attr("height", height)
        .call(chart);
      return chart;
    });

    nv.addGraph(function () {
      var chart = nv.models
        .pieChart()
        .x(function (d) {
          return d.key;
        })
        .y(function (d) {
          return d.y;
        })
        .width(width)
        .height(height)
        .showTooltipPercent(true);
      d3.select("#distributionByTag")
        .datum(distribution_by_tag)
        .transition()
        .duration(1200)
        .attr("width", width)
        .attr("height", height)
        .call(chart);
      return chart;
    });

    var incident_count_by_month_data = [
      {
        key: "Month",
        color: "#ccf",
        values: JSON.parse(incident_count_by_month),
      },
    ];

    // Incident by month
    nv.addGraph(function () {
      var chart = nv.models.multiBarChart();

      chart.xAxis.tickFormat(function (d) {
        return d3.timeFormat("%B")(new Date(d));
      });

      chart.yAxis.tickFormat(d3.format(",f"));

      d3.select("#incidentByMonth")
        .datum(incident_count_by_month_data)
        .transition()
        .duration(500)
        .call(chart);

      nv.utils.windowResize(chart.update);

      return chart;
    });

    var down_by_hour = [
      {
        key: "Hour",
        color: "#ccf",
        values: JSON.parse(down_count_by_hour),
      },
    ];

    // Incident by month
    nv.addGraph(function () {
      var chart = nv.models.multiBarChart();

      chart.xAxis.tickFormat(function (d) {
        return d + ":00";
      });

      chart.yAxis.tickFormat(d3.format(",f"));

      d3.select("#downCountByHour")
        .datum(down_by_hour)
        .transition()
        .duration(500)
        .call(chart);

      nv.utils.windowResize(chart.update);

      return chart;
    });

    var count_by_hour = [
      {
        key: "Hour",
        color: "#ccf",
        values: JSON.parse(up_count_by_hour),
      },
    ];

    // Incident by month
    nv.addGraph(function () {
      var chart = nv.models.multiBarChart();

      chart.xAxis.tickFormat(function (d) {
        return d + ":00";
      });

      chart.yAxis.tickFormat(d3.format(",f"));

      d3.select("#upCountByHour")
        .datum(count_by_hour)
        .transition()
        .duration(500)
        .call(chart);

      nv.utils.windowResize(chart.update);

      return chart;
    });
  }, []);

  const charts = [
    {
      id: "topIncidents",
      title: "Incidents",
    },
    {
      id: "status",
      title: "Status",
    },
    {
      id: "topIncidentByTag",
      title: "Top Reported by Tag",
    },
    {
      id: "distributionByTag",
      title: "Distribution by Tag",
    },
    {
      id: "incidentByMonth",
      title: "Reported by Month",
    },
    {
      id: "downCountByHour",
      title: "Down by Hour",
    },
    {
      id: "upCountByHour",
      title: "Up by Hour",
    },
  ];
  return (
    <ThemeProvider theme={theme}>
      {!top_incidents.length ? (
        <Hero
          title="No Analytics"
          subtitle="No analytics to report on."
          icon={<TimelineIcon fontSize="large" color="primary" />}
        />
      ) : (
        <Grid container spacing={2}>
          {charts.map((c) => (
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title={c.title} />
                <Divider />
                <CardContent>
                  <svg id={c.id} className="mypiechart" height="350px"></svg>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </ThemeProvider>
  );
}

export default ShowAnalytics;
