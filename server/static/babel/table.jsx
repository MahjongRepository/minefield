
function Table(props) {
  var doraIndTile = <Tile type={props.doraInd} />;
  var eastDisplay;
  if (props.isEast) {
    eastDisplay = <img src="tiles/E.svg" title="East" />;
  } else {
    eastDisplay = <img src="tiles/E.svg" title="West" />;
  }

  var stick, opponentStick;
  if (props.discards && props.discards.length > 0) {
    stick = <div className="stick any-stick" />;
  }
  if (props.opponentDiscards && props.opponentDiscards.length > 0) {
    opponentStick = <div className="opponent-stick any-stick" />;
  }

  var submitButton;
  if (props.showSubmit) {
    if (props.onSubmit) {
      submitButton = <button className="submit-hand" onClick={props.onSubmit}>OK</button>;
    } else {
      submitButton = <button className="submit-hand" disabled>OK</button>;
    }
  }

  return (
    <div className="table">
      <div className="dora-display">{doraIndTile}</div>
      <div className="east-display">{eastDisplay}</div>
      {stick}
      {opponentStick}
      <TileList className="discards any-discards" types={props.discards} />
      <TileList className="opponent-discards any-discards" types={props.opponentDiscards} />
      <TileList onTileClick={props.onTileClick} className="tiles" types={props.tiles} />
      <TileList onTileClick={props.onHandTileClick} className="hand" types={props.hand} />
      {submitButton}
    </div>
  );
}


class TablePhaseOne extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tiles: props.tiles,
      handData: [],
    }
  }

  render() {
    var onTileClick;
    var hand = this.state.handData.map(h => h.type);
    var onSubmit;
    if (hand.length == 13) {
      onSubmit = () => {
        if (this.props.onSubmit)
          this.props.onSubmit(this.state.tiles, hand);
      };
    } else {
      onTileClick = this.onTileClick.bind(this);
    }


    return (
      <Table doraInd={this.props.doraInd}
              isEast={this.props.isEast}
              tiles={this.state.tiles}
              hand={hand}
              onTileClick={onTileClick}
              onHandTileClick={this.onHandTileClick.bind(this)}
              showSubmit={true}
              onSubmit={onSubmit} />
    );
  }

  onTileClick(i, type) {
    var tiles = this.state.tiles.slice();
    var handData = this.state.handData.slice();
    handData.push({ type: tiles[i], index: i });
    tiles[i] = '';
    handData.sort((h1, h2) => {
      if (h1.type < h2.type) {
        return -1;
      } else if (h1.type == h2.type) {
        return 0;
      } else {
        return 1;
      }
    });
    this.setState({tiles: tiles, handData: handData});
  }

  onHandTileClick(i, type) {
    var tiles = this.state.tiles.slice();
    var handData = this.state.handData.slice();
    var h = handData[i];
    handData.splice(i, 1);
    tiles[h.index] = h.type;
    this.setState({tiles: tiles, handData: handData});
  }
}

function TablePhaseTwo(props) {
  var onTileClick = (i, type) => {
    var tiles = props.tiles.slice();
    var discards = props.discards.slice();
    var discard = tiles[i];
    tiles[i] = '';
    discards.push(discard);
    if (props.onDiscard)
      props.onDiscard(discard, tiles, discards);
  }
  return <Table {...props} onTileClick={onTileClick} />;
}
