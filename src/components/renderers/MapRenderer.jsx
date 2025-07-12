import React, { useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

const MapRenderer = ({ config }) => {
  const mapRef = useRef(null)
  const googleMapRef = useRef(null)

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: config.apiKey || window.GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
      })

      try {
        const { Map } = await loader.importLibrary('maps')
        const { Marker } = await loader.importLibrary('marker')

        const defaultCenter = { lat: 37.7749, lng: -122.4194 } // San Francisco
        const center = config.center || defaultCenter

        googleMapRef.current = new Map(mapRef.current, {
          center,
          zoom: config.zoom || 12,
          ...config.options
        })

        if (config.markers) {
          config.markers.forEach(markerConfig => {
            new Marker({
              position: markerConfig.position,              map: googleMapRef.current,
              title: markerConfig.title || '',
              ...markerConfig.options
            })
          })
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error)
      }
    }

    if (mapRef.current && !googleMapRef.current) {
      initMap()
    }
  }, [config])

  return (
    <div className="w-full h-64 my-4 rounded-lg overflow-hidden border border-chatbot-border">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}

export default MapRenderer