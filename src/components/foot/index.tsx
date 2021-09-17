import React from "react";

interface Props {
  isStart: boolean;
  ballAmount: number;
  begin: () => void;
  onChangeBall: (value: number) => void;
}

export class FootPage extends React.PureComponent<Props> {

  renderOption = () => {
    const amount = new Array(32).fill(1);
    return(<>
      {amount.map((item, index) => {
        return (<option value ={index + 1} key={index}>{index + 1}</option>);
      })}
    </>);
  }

  render() {
    return (<div>
      <select defaultValue={this.props.ballAmount} onChange={(event) => {
        console.log(event.target.value);
        this.props.onChangeBall(Number(event.target.value));
      }}>
        {this.renderOption()}
    </select>
    <button disabled={this.props.isStart} onClick={this.props.begin}>{"开始游戏"}</button>
    </div>);
  }
}