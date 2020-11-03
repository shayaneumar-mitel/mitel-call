// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import './App.css';
import { findDOMNode } from 'react-dom';
import $ from 'jquery';

/**
 * This component is used to display the required
 * terms of use statement which can be found in a
 * link in the about tab.
 */
class MitelDialer extends React.Component {
  componentDidMount() {
    var count = 0;

    $(".digit").on('click', function () {
      var num = ($(this).clone().children().remove().end().text());
      if (count < 11) {
        $("#output").append('<span>' + num.trim() + '</span>');
        $("#entered-number").val($("#entered-number").val() + num.trim());
        count++
      }
    });

    $('.fa-long-arrow-left').on('click', function () {
      $('#output span:last-child').remove();
      count--;
    });

    $("#call").on('click', function () {
      console.log($("#entered-number").val());
      window.location = 'tel://' + $("#entered-number").val();
    });
  }
  render() {
    return (
      <div class="container">
        <div id="output"></div>
        <div class="row">
          <div class="digit" id="one">1</div>
          <div class="digit" id="two">2
          <div class="sub">ABC</div>
          </div>
          <div class="digit" id="three">3
          <div class="sub">DEF</div>
          </div>
        </div>
        <div class="row">
          <div class="digit" id="four">4
          <div class="sub">GHI</div>
          </div>
          <div class="digit" id="five">5
          <div class="sub">JKL</div>
          </div>
          <div class="digit">6
          <div class="sub">MNO</div>
          </div>
        </div>
        <div class="row">
          <div class="digit">7
          <div class="sub">PQRS</div>
          </div>
          <div class="digit">8
          <div class="sub">TUV</div>
          </div>
          <div class="digit">9
          <div class="sub">WXYZ</div>
          </div>
        </div>
        <div class="row">
          <div class="digit">*
        </div>
          <div class="digit">0
        </div>
          <div class="digit">#
        </div>
        </div>
        <div class="botrow"><i class="fa fa-star-o dig" aria-hidden="true"></i>
          <div id="call"><i class="fa fa-phone" aria-hidden="true"></i></div>
          <i class="fa fa-long-arrow-left dig" aria-hidden="true"></i>
        </div>
        <input type="text" id="entered-number" style={{ display: 'none' }} />
      </div>
    );
  }
}

export default MitelDialer;