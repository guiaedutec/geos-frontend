import React from 'react';
import styles from './styles.styl';
import classNames from 'classnames';
import CirclePie from '~/components/Chart/CirclePie';
import $ from "jquery";

class Card extends React.Component {

  constructor(props) {
    super(props)
    this.toggleViewCard = this.toggleViewCard.bind(this)
    this.toggleAllCard = this.toggleAllCard.bind(this)
  }

  toggleViewCard(e) {
    let btn = $(e.target).parents("a");
    if($(btn).hasClass("_180")){
      $(btn).removeClass("_180");
    } else{
      $(btn).addClass("_180");
    }

    $(e.target).parents(".card-collapse").find(".toggle").each(function(){
      if($(this).hasClass("is-hidden")){
        $(this).removeClass("is-hidden");
      } else{
        $(this).addClass("is-hidden");
      }
    })
  }

  toggleAllCard(e) {
    let btn = $(e.target).parents("a");
    let btnToEnable = btn.siblings("a").first()
    let isExpand = btn.attr("data-ref") == "expand" ? true : false

    btn.addClass("is-hidden")
    btnToEnable.removeClass("is-hidden")

    if(isExpand){
      $(".rotate").addClass("_180")
    } else {
      $(".rotate").removeClass("_180")
    }

    $(".card-collapse").find(".toggle").each(function(){
      if(isExpand){
        $(this).removeClass("is-hidden");
      } else{
        $(this).addClass("is-hidden");
      }
    })
  }

  render() {
    return (
      !this.props.loading ?
        <div className={styles.cards}>
          <div className={styles.nav_collapse}>
            <div className="is-pulled-right">
              <a onClick={this.toggleAllCard} data-ref="expand">
                <i className="fas fa-expand"></i>
              </a>
              <a onClick={this.toggleAllCard} className="is-hidden" data-ref="compress">
                <i className="fas fa-compress"></i>
              </a>
            </div>
          </div>
          {
            this.props.networks.map((network, idx) => (
              <div key={network[0] + idx} className={classNames("card card-collapse", styles.card_collapse)}>
                <header className="card-header">
                  <a onClick={this.toggleViewCard} className="card-header-icon rotate" aria-label="more options">
                <span className="icon">
                  <i className="fas fa-angle-down" aria-hidden="true"></i>
                </span>
                  </a>
                  <p className="card-header-title is-uppercase">
                    {network[0]}
                  </p>
                </header>
                <div className={classNames("card-content toggle is-hidden", styles.card_content)}>
                  <div className="content">
                    <div className="columns is-marginless">
                      {
                        network[1].filter(nw => nw[0] != "Municipal").map((nw, i) => {
                          return <div key={nw[0] + i} className={classNames("column", styles.column)}>
                            <div className="has-text-centered">
                              <span className={styles.type}>{nw[0]}</span>
                            </div>
                            <div className={styles.is_flex}>
                              <span className={classNames("mr-3", styles.is_flex)}>
                                <span className="is-size-5 mr-1">{nw[1].quantity}</span>
                                <i className="fas fa-user-friends"></i>
                              </span>
                              {
                                nw[0] == "Estadual" &&
                                  <span className={styles.is_flex}>
                                    <span className="is-size-5 mr-1">{((nw[1].quantity * 100) / nw[1].target).toFixed(2)}%</span>
                                    <CirclePie percent={Number(Math.ceil((nw[1].quantity * 100) / nw[1].target))}
                                               width={20} height={20} labelColor={"#ffffff"} strokeColor={"#131d3c"}
                                               railColor={"#cccccc"} labelFontSize={0}/>
                                  </span>
                              }
                            </div>
                          </div>
                        })
                      }
                    </div>
                    <div className="columns is-marginless">
                      {
                        network[1].filter(nw => nw[0] == "Municipal").map((nw, i) => {
                          return <div key={nw[0] + i} className={classNames("column is-full", styles.municipal)}>
                            <div className="has-text-centered">
                              <span className={styles.type}>{nw[0]}</span>
                            </div>
                            <div className="columns is-marginless is-multiline is-centered">
                            {
                              Object.entries(nw[1]).map((n, j) => {
                                return <div key={n[0] + j} className={classNames("column is-3", styles.column)}>
                                  <div className="has-text-centered has-text-weight-bold">{n[0]}</div>
                                  <div className={styles.is_flex}>
                                    <span className={classNames("mr-3", styles.is_flex)}>
                                      <span className="is-size-5 mr-1">{n[1].quantity}</span>
                                      <i className="fas fa-user-friends"></i>
                                    </span>
                                    <span className={styles.is_flex}>
                                      <span className="is-size-5 mr-1">{((n[1].quantity * 100) / n[1].target).toFixed(2)}%</span>
                                      <CirclePie percent={Number(Math.ceil((n[1].quantity * 100) / n[1].target))}
                                                 width={20} height={20} labelColor={"#ffffff"} strokeColor={"#131d3c"}
                                                 railColor={"#cccccc"} labelFontSize={0}/>
                                    </span>
                                  </div>
                                </div>
                              })
                            }
                            </div>
                          </div>
                        })
                      }
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        : null
    )
  }
}
export default Card;
