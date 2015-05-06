import Ember from 'ember';
import ChartistChart from './chartist-chart';

export default ChartistChart.extend({
  type: 'line',
  ratio: 'ct-minor-seventh',
  options: {
    showPoint: true,
    axisY: {
      offset: 0,
      showgrid: true,
      labelInterpolationFnc: function(value) {
        return value + 'A';
      },
    },
    axisX: {
      showGrid: false,
      labelInterpolationFnc: function(value) {
        return value + 'v';
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

  init: function() {
    this._super();

    var chartData = {
      labels: ['0', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'],
      series: [
        {
          name: '5mA',
          data: [0.0001, 0.087, 0.176, 0.214, 0.229, 0.236, 0.241, 0.243, 0.246, 0.246, 0.247, 0.249, 0.251, 0.251, 0.253, 0.256, 0.257, 0.258, 0.25876, 0.259111, 0.25966],
        },
        {
          name: '3ma',
          data: [0.0001, 0.082, 0.173, 0.205, 0.21, 0.216, 0.225, 0.234, 0.236, 0.239, 0.24011, 0.24015, 0.241003, 0.24231, 0.24367, 0.247324, 0.25113, 0.252234, 0.25248, 0.25254, 0.26235],
        },
        {
          name: '1ma',
          data: [0.0001, 0.075, 0.169, 0.178, 0.182, 0.1845, 0.1867, 0.192, 0.193, 0.196, 0.20135, 0.20145, 0.21567, 0.21587, 0.22453, 0.23521, 0.23556, 0.23589, 0.23674, 0.237543, 0.239761],
        },
      ]
    };
    this.set('data', chartData);
  },

  updateData: function() {
    console.log('update');
    var steps = this.get('test.currentSteps'),
        chartData = {
          labels: this.get('labels'),
          series: []
        };

    steps.forEach(function(step, i) {
      chartData.series[i] = {name: step.get('ma') + 'ma', data: []};

      step.get('points').forEach(function(point) {
        chartData.series[i].data.push(point.get('current')); 
      });
    });

    console.log(chartData);
    this.set('data', chartData);
  }.observes('test.currentSteps.@each.points'),

  labels: function() {
    var start = this.get('test.voltageRangeFrom'),
        end = this.get('test.voltageRangeTo'),
        increment = this.get('test.increment'),
        labels = [];

    while (start < end) {
      labels.push(start);
      start += increment;
    }

    return labels;
  }.property('test.voltageRAngeFrom', 'test.voltageRangeTo', 'test.increment'),

  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this, 'setupToolTip');
  },

  setupToolTip: function() {
    var chart = Ember.$(this.get('element'));

    var toolTip = chart.append('<div class="tooltip"></div>')
                    .find('.tooltip')
                    .hide();

    chart.on('mouseenter', '.ct-point', function() {
        var point = Ember.$(this),
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
