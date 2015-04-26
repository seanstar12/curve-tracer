import Ember from 'ember';
import ChartistChart from './chartist-chart';

export default ChartistChart.extend({
  type: 'line',
  test: null,

  init: function() {
    var test = this.get('test');

    Ember.run.scheduleOnce('afterRender', this, 'setupToolTip');

    var chartData = {
      labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      series: [
        {
          name: 'woot',
          data: [0, 1, 1,5, 1.8, 2.0, 2,1],
        },
        {
          name: 'woot2',
          data: [1,3,12],
        },
        {
          name: 'woot3',
          data: [3,4,5],
        },
      ]
    };
    this.set('data', chartData);

    this._super();
  },

  ratio: 'ct-minor-seventh',
  options: {
    showPoint: true,
    axisY: {
      offset: 0,
      showgrid: true,
      labelInterpolationFnc: function(value) {
        return value + 'A'
      },
    },
    axisX: {
      showGrid: false,
      labelInterpolationFnc: function(value) {
        return value + 'v'
      },
    },
  },

  responsiveOptions: [
    ['screen and (min-width: 640px)', {
      showPoint: true,
      axisY: {
        offset: 50,
        showLabel: true,
      }
    }],
  ],

  setupToolTip: function() {
    var chart = $(this.get('element'));

    var toolTip = chart.append('<div class="tooltip"></div>')
                    .find('.tooltip')
                    .hide();

    chart.on('mouseenter', '.ct-point', function() {
        var point = $(this),
            value = point.attr('ct:value'),
            seriesName = point.parent().attr('ct:series-name');

          toolTip.html(seriesName + '<br>' + value).show();
    });

    chart.on('mouseleave', '.ct-point', function() {
        toolTip.hide();
    });

    chart.on('mousemove', function(event) {
      toolTip.css({
        left: (event.offsetX || event.originalEvent.layerX) - toolTip.width() / 2 - 10,
        top: (event.offsetY || event.originalEvent.layerY) - toolTip.height() - 40
      });
    });
  },
});
