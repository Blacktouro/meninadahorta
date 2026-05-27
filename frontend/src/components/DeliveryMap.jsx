import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import '../styles/deliveryMap.css'

const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
})

function MapClickHandler({ onSelectPoint }) {
    useMapEvents({
        click(e) {
            if (!onSelectPoint) return

            const { lat, lng } = e.latlng
            onSelectPoint(lat, lng)
        }
    })

    return null
}

function DeliveryMap({ entregaInfo, onSelectPoint }) {
    if (
        !entregaInfo ||
        !entregaInfo.destination_lat ||
        !entregaInfo.destination_lng ||
        !entregaInfo.origin_lat ||
        !entregaInfo.origin_lng
    ) {
        return null
    }

    const origem = [entregaInfo.origin_lat, entregaInfo.origin_lng]
    const destino = [entregaInfo.destination_lat, entregaInfo.destination_lng]

    return (
        <div className="delivery-map-wrapper">

            <div className="delivery-map-help">
                📍 Clica no mapa para ajustar o ponto exato da entrega.
            </div>

            <div className="delivery-map-box">
                <MapContainer
                    center={destino}
                    zoom={15}
                    scrollWheelZoom={false}
                    className="delivery-map"
                >
                    <TileLayer
                        attribution='&copy; OpenStreetMap'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapClickHandler onSelectPoint={onSelectPoint} />

                    <Marker position={origem} icon={markerIcon}>
                        <Popup>Loja / ponto de saída</Popup>
                    </Marker>

                    <Marker position={destino} icon={markerIcon}>
                        <Popup>Ponto de entrega</Popup>
                    </Marker>

                    <Polyline positions={[origem, destino]} />
                </MapContainer>
            </div>

        </div>
    )
}

export default DeliveryMap
