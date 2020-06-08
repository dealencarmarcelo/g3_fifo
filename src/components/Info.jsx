import React, { Component } from 'react';
import { Checkbox, InputNumber } from 'antd';
import "antd/dist/antd.css";

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
                <div style={{ height: 'auto', margin: 'auto', display: 'flex', flexDirection: 'column' }}>
                    <h2>Atendentes</h2>
                    <p>Defina quais atendentes ficarão disponíveis:</p>
                    <div style={{ display: 'flex', flexDirection: 'row', margin: 'auto' }}>
                        {this.props.gates.map((v, i) => {
                            return (
                                <Checkbox onChange={() => { this.changeGate(i) }} key={i}><strong>{v.name}</strong></Checkbox>
                            )
                        })}
                    </div>
                    <h2 style={{ marginTop: 30 }}>Configurações</h2>
                    <div style={{ margin: 'auto' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', margin: 'auto' }}>
                            <p>Intervalo de chegada (em segundos):</p>
                            <InputNumber style={{ height: 28, marginLeft: 10, marginTop: 0 }} disabled={this.props.active} onChange={this.props.setArraivalTiming} min={0} max={20} step={0.1} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', margin: 'auto' }}>
                            <p>Tempo máximo de atendimento (em segundos):</p>
                            <InputNumber style={{ height: 28, marginLeft: 10, marginTop: 0 }} disabled={this.props.active} onChange={this.props.setMaxAttendanceTiming} min={0} max={30} step={1} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', margin: 'auto' }}>
                            <p>Número máximo de chegada:</p>
                            <InputNumber style={{ height: 28, marginLeft: 10, marginTop: 0 }} disabled={this.props.active} onChange={this.props.setMaxArrivalTiming} min={0} max={10} step={1} />
                        </div>
                    </div>
                </div>
                <div style={{ height: 'auto', marginTop: 30, alignItems: 'start', display: 'block' }}>
                    <h2>Métricas</h2>
                    <div style={{ width: 500, marginTop: 20, alignItems: 'start', display: 'flex', flexDirection: 'column' }}>
                        <p style={{ marginLeft: 50, fontSize: 16 }}>Tempo médio de atendimento: {(this.props.atendimentoMedio / 60).toFixed(1)} minutos</p>
                        <p style={{ marginLeft: 50, fontSize: 16 }}>Tempo médio na fila: {(this.props.queueTiming / 60).toFixed(1)} minutos</p>
                        <p style={{ marginLeft: 50, fontSize: 16 }}>Tempo médio no sistema: {((this.props.queueTiming + this.props.atendimentoMedio) / 60).toFixed(1)} minutos</p>
                    </div>
                </div>
            </div>
        );
    }
}