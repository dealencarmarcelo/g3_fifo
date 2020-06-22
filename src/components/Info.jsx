import React, { Component } from 'react';
import { Checkbox, InputNumber } from 'antd';
import "antd/dist/antd.css";
import '../App.css';

export default class Info extends Component {

    constructor(props) {
        super(props);
    }

    changeGate = (i, e) => {
        this.props.gates[i].status = !this.props.gates[i].status
    }

    render() {
        return (
            <div>
                <div className="info">
                    <h2>Atendentes</h2>
                    <p>Defina quais atendentes ficarão disponíveis:</p>
                    <div className="info-checkbox">
                        {this.props.gates.map((v, i) => {
                            return (
                                <Checkbox onChange={() => { this.changeGate(i) }} key={i}><strong>{v.name}</strong></Checkbox>
                            )
                        })}
                    </div>
                    <h2 style={{ marginTop: 30 }}>Configurações</h2>
                    <div style={{ margin: 'auto' }}>
                        <div className="info-checkbox">
                            <p>Intervalo de chegada (em segundos):</p>
                            <InputNumber className="info-input" disabled={this.props.active} onChange={this.props.setArraivalTiming} min={0} max={20} step={0.1} />
                        </div>
                        <div className="info-checkbox">
                            <p>Tempo máximo de atendimento (em segundos):</p>
                            <InputNumber className="info-input" disabled={this.props.active} onChange={this.props.setMaxAttendanceTiming} min={0} max={30} step={1} />
                        </div>
                        <div className="info-checkbox">
                            <p>Número máximo de chegada:</p>
                            <InputNumber className="info-input" disabled={this.props.active} onChange={this.props.setMaxArrivalTiming} min={0} max={10} step={1} />
                        </div>
                    </div>
                </div>
                <div className="info-metrics">
                    <h2>Métricas</h2>
                    <div className="info-metric">
                        <p className="Info-metric-p">Tempo médio de atendimento: {(this.props.atendimentoMedio / 60).toFixed(1)} minutos</p>
                        <p className="Info-metric-p">Tempo médio na fila: {(this.props.queueTiming / 60).toFixed(1)} minutos</p>
                        <p className="Info-metric-p">Tempo médio no sistema: {((this.props.queueTiming + this.props.atendimentoMedio) / 60).toFixed(1)} minutos</p>
                    </div>
                </div>
            </div>
        );
    }
}