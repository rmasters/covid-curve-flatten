import React from "react";
import Plot from "react-plotly.js";
import Loading from "./loading";
import DelayedRender from "./delay-render";
import './styles.scss';

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/, '-');
}

function Country(props) {
  return (
    <article className="country" id={slugify(props.name)}>
      <span className="country__ranking">{props.ranking}</span>
      <h2 className="country__name">{props.name}</h2>
        <CountryChart data={props.cases} />
    </article>
  );
}

function CountryChart(props) {
  const latestDate = Array.from(props.data.keys()).slice(-1);
  const latestCases = Array.from(props.data.values()).slice(-1);

  const data = [
    {
      x: Array.from(props.data.keys()),
      y: Array.from(props.data.values()),
      type: 'lines',
    },
  ];

  const fmt = new Intl.NumberFormat();
  const layout = {
    showlegend: false,
    margin: {l: 0, r: 0, t: 0, b: 0, autoexpand: false},
    height: 50,
    width: 250,
    xaxis: { showgrid: false, showline: false, zeroline: false },
    yaxis: { showgrid: false, showline: false, zeroline: false },
    annotations: [
      {
        x: latestDate[0],
        y: latestCases[0],
        xanchor: 'left',
        yanchor: 'middle',
        text: fmt.format(latestCases[0]),
        showarrow: false,
      }
    ]
  };

  return <Plot data={data} layout={layout} config={{staticPlot: true}} />;
}

class Countries extends React.Component {
  constructor(props) {
    super(props);

    this.refreshHandle = null;
    this.state = {countries: []};
  }

  async componentDidMount() {
    const countries = await this.fetchData();

    this.setState({countries});
    this.refreshHandle = window.setTimeout(this.fetchData.bind(this), 3600 * 1000);
  }

  componentWillUnmount() {
    window.clearTimeout(this.refreshHandle);
    delete this.refreshHandle;
  }

  async fetchData() {
    const resp = await fetch("/cases.json");
    const data = await resp.json();

    const countries = [];
    for (let [name, timeSeries] of Object.entries(data.cases)) {
      const cases = new Map();
      const caseDates = Object.keys(timeSeries).sort((a, b) => a > b ? 1 : -1);
      for (let date of caseDates) {
        cases.set(date, timeSeries[date]);
      }

      const latestCases = cases.get(caseDates.slice(-1)[0]);

      countries.push({
        name,
        ranking: 0,
        cases,
        latestCases,
      });
    }

    return countries;
  }

  render() {
    if (this.state.countries.length == 0) {
      return <div className="loading"><Loading /></div>;
    }

    const countries = this.state.countries
      .sort((a, b) => a.latestCases > b.latestCases ? -1 : 1)
      .map((country, idx) => {
        return (
          <DelayedRender wait={100 * idx} key={slugify(country.name)}>
            <Country
              name={country.name}
              ranking={country.ranking}
              cases={country.cases}
              />
          </DelayedRender>
        );
      });

    return (
      <section className="countries">
        {countries}
      </section>
    );
  }
}

export default function CountriesPage() {
  return (
    <section className="container">
      <header className="header">
        <h1 className="header__title">Who's Flattening the Curve?</h1>
        <p className="header__intro">
          A look at each country's cases of COVID-19 over time. In order for a country to minimise its mortality rate,
          it is generally accepted the number of cases must be gradual rather than sudden, in order not to exceed the number of critical care beds available.
        </p>
        <p className="header__intro">
          <span className="todo">Todo</span> I'd like to show each curve against the number of CCU beds each country has available, but I'm still hunting down data for this.
        </p>
        <ul className="header__notes">
          <li>Built on data from <a href="https://github.com/CSSEGISandData/COVID-19" target="_blank">JHU</a></li>
          <li><a href="https://github.com/rmasters/covid-curve-flatten" target="_blank">Open source</a></li>
          <li>Ping <a href="https://twitter.com/rossmasters" rel="author" target="_blank">@rossmasters</a></li>
          <li><a href="https://staythefuckhome.com/" target="_blank">#staythefuckhome</a></li>
        </ul>
      </header>
      <Countries />
    </section>
  );
}
