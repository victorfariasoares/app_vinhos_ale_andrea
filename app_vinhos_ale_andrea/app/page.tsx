"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Plus,
  WineIcon,
  MapPin,
  Star,
  Calendar,
  DollarSign,
  FileText,
  Camera,
  Filter,
  ArrowUpDown,
  Edit,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface Wine {
  id: string
  name: string
  producer: string
  type: string
  vintage: string
  photo: string
  purchaseLocation: string
  price: string
  currency: string
  rating: number
  notes: string
  dateAdded: string
}

export default function WineCatalog() {
  const [wines, setWines] = useState<Wine[]>([])

  useEffect(() => {
    // Carregar dados salvos do localStorage
    const savedWines = localStorage.getItem("wine-catalog-data")
    if (savedWines) {
      try {
        setWines(JSON.parse(savedWines))
      } catch (error) {
        console.error("Erro ao carregar dados salvos:", error)
        // Se houver erro, usar dados de exemplo
        setWines([
          {
            id: "1",
            name: "Cabernet Sauvignon Reserva",
            producer: "Miolo",
            type: "Tinto",
            vintage: "2020",
            photo: "/placeholder.svg?height=200&width=200",
            purchaseLocation: "Supermercado Zaffari",
            price: "45,00",
            currency: "BRL",
            rating: 5,
            notes: "Excelente vinho para acompanhar carnes vermelhas. Sabor encorpado e final prolongado.",
            dateAdded: "2024-01-15",
          },
          {
            id: "2",
            name: "Chardonnay",
            producer: "Casa Valduga",
            type: "Branco",
            vintage: "2022",
            photo: "/placeholder.svg?height=200&width=200",
            purchaseLocation: "Vinícola (visita)",
            price: "38,00",
            currency: "BRL",
            rating: 4,
            notes: "Perfeito para peixes e frutos do mar. Muito refrescante no verão.",
            dateAdded: "2024-02-03",
          },
        ])
      }
    } else {
      // Se não houver dados salvos, usar dados de exemplo
      setWines([
        {
          id: "1",
          name: "Cabernet Sauvignon Reserva",
          producer: "Miolo",
          type: "Tinto",
          vintage: "2020",
          photo: "/placeholder.svg?height=200&width=200",
          purchaseLocation: "Supermercado Zaffari",
          price: "45,00",
          currency: "BRL",
          rating: 5,
          notes: "Excelente vinho para acompanhar carnes vermelhas. Sabor encorpado e final prolongado.",
          dateAdded: "2024-01-15",
        },
        {
          id: "2",
          name: "Chardonnay",
          producer: "Casa Valduga",
          type: "Branco",
          vintage: "2022",
          photo: "/placeholder.svg?height=200&width=200",
          purchaseLocation: "Vinícola (visita)",
          price: "38,00",
          currency: "BRL",
          rating: 4,
          notes: "Perfeito para peixes e frutos do mar. Muito refrescante no verão.",
          dateAdded: "2024-02-03",
        },
      ])
    }
  }, [])

  useEffect(() => {
    // Salvar dados no localStorage sempre que a lista de vinhos mudar
    localStorage.setItem("wine-catalog-data", JSON.stringify(wines))
  }, [wines])

  const [isAddingWine, setIsAddingWine] = useState(false)
  const [editingWine, setEditingWine] = useState<Wine | null>(null)
  const [newWine, setNewWine] = useState<Partial<Wine>>({
    rating: 3,
    currency: "BRL",
  })

  const [sortBy, setSortBy] = useState<string>("date-desc")
  const [showFilters, setShowFilters] = useState(false)

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "BRL":
        return "R$"
      case "USD":
        return "US$"
      case "EUR":
        return "€"
      case "ARS":
        return "$"
      default:
        return "R$"
    }
  }

  const handleAddWine = () => {
    if (newWine.name && newWine.producer) {
      if (editingWine) {
        // Editando vinho existente
        const updatedWine: Wine = {
          ...editingWine,
          name: newWine.name || "",
          producer: newWine.producer || "",
          type: newWine.type || "",
          vintage: newWine.vintage || "",
          photo: newWine.photo || "/placeholder.svg?height=200&width=200",
          purchaseLocation: newWine.purchaseLocation || "",
          price: newWine.price || "",
          currency: newWine.currency || "BRL",
          rating: newWine.rating || 3,
          notes: newWine.notes || "",
        }
        setWines(wines.map((wine) => (wine.id === editingWine.id ? updatedWine : wine)))
        setEditingWine(null)
      } else {
        // Adicionando novo vinho
        const wine: Wine = {
          id: Date.now().toString(),
          name: newWine.name || "",
          producer: newWine.producer || "",
          type: newWine.type || "",
          vintage: newWine.vintage || "",
          photo: newWine.photo || "/placeholder.svg?height=200&width=200",
          purchaseLocation: newWine.purchaseLocation || "",
          price: newWine.price || "",
          currency: newWine.currency || "BRL",
          rating: newWine.rating || 3,
          notes: newWine.notes || "",
          dateAdded: new Date().toISOString().split("T")[0],
        }
        setWines([wine, ...wines])
      }
      setNewWine({ rating: 3, currency: "BRL" })
      setIsAddingWine(false)
    }
  }

  const handleEditWine = (wine: Wine) => {
    setEditingWine(wine)
    setNewWine({
      name: wine.name,
      producer: wine.producer,
      type: wine.type,
      vintage: wine.vintage,
      photo: wine.photo,
      purchaseLocation: wine.purchaseLocation,
      price: wine.price,
      currency: wine.currency,
      rating: wine.rating,
      notes: wine.notes,
    })
    setIsAddingWine(true)
  }

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setNewWine({ ...newWine, photo: event.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const sortWines = (wines: Wine[], sortBy: string) => {
    const sorted = [...wines]
    switch (sortBy) {
      case "date-desc":
        return sorted.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
      case "date-asc":
        return sorted.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime())
      case "price-desc":
        return sorted.sort((a, b) => {
          const priceA = Number.parseFloat(a.price.replace(/[^\d,]/g, "").replace(",", ".")) || 0
          const priceB = Number.parseFloat(b.price.replace(/[^\d,]/g, "").replace(",", ".")) || 0
          return priceB - priceA
        })
      case "price-asc":
        return sorted.sort((a, b) => {
          const priceA = Number.parseFloat(a.price.replace(/[^\d,]/g, "").replace(",", ".")) || 0
          const priceB = Number.parseFloat(b.price.replace(/[^\d,]/g, "").replace(",", ".")) || 0
          return priceA - priceB
        })
      case "rating-desc":
        return sorted.sort((a, b) => b.rating - a.rating)
      case "rating-asc":
        return sorted.sort((a, b) => a.rating - b.rating)
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name))
      default:
        return sorted
    }
  }

  const getSortedWines = () => sortWines(wines, sortBy)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "tinto":
        return "bg-red-100 text-red-800"
      case "branco":
        return "bg-yellow-100 text-yellow-800"
      case "rosé":
        return "bg-pink-100 text-pink-800"
      case "espumante":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <WineIcon className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-800">Vinhos do Alessandro & Andrea</h1>
          </div>
          <p className="text-gray-600">Catálogo dos nossos vinhos preferidos</p>
        </div>

        {/* Add Wine Button */}
        <Dialog
          open={isAddingWine}
          onOpenChange={(open) => {
            setIsAddingWine(open)
            if (!open) {
              setEditingWine(null)
              setNewWine({ rating: 3, currency: "BRL" })
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="w-full mb-6 bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Novo Vinho
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <WineIcon className="w-5 h-5" />
                {editingWine ? "Editar Vinho" : "Novo Vinho"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <Label htmlFor="name">Nome do Vinho *</Label>
                <Input
                  id="name"
                  value={newWine.name || ""}
                  onChange={(e) => setNewWine({ ...newWine, name: e.target.value })}
                  placeholder="Ex: Cabernet Sauvignon"
                />
              </div>

              <div>
                <Label htmlFor="producer">Produtor *</Label>
                <Input
                  id="producer"
                  value={newWine.producer || ""}
                  onChange={(e) => setNewWine({ ...newWine, producer: e.target.value })}
                  placeholder="Ex: Miolo, Casa Valduga"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={newWine.type || ""} onValueChange={(value) => setNewWine({ ...newWine, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tinto">Tinto</SelectItem>
                      <SelectItem value="Branco">Branco</SelectItem>
                      <SelectItem value="Rosé">Rosé</SelectItem>
                      <SelectItem value="Espumante">Espumante</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="vintage">Safra</Label>
                  <Input
                    id="vintage"
                    value={newWine.vintage || ""}
                    onChange={(e) => setNewWine({ ...newWine, vintage: e.target.value })}
                    placeholder="2023"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Onde Comprou</Label>
                <Input
                  id="location"
                  value={newWine.purchaseLocation || ""}
                  onChange={(e) => setNewWine({ ...newWine, purchaseLocation: e.target.value })}
                  placeholder="Ex: Zaffari, Vinícola"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="price">Preço</Label>
                  <Input
                    id="price"
                    value={newWine.price || ""}
                    onChange={(e) => setNewWine({ ...newWine, price: e.target.value })}
                    placeholder="45,00"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Moeda</Label>
                  <Select
                    value={newWine.currency || "BRL"}
                    onValueChange={(value) => setNewWine({ ...newWine, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">🇧🇷 Real (R$)</SelectItem>
                      <SelectItem value="USD">🇺🇸 Dólar (US$)</SelectItem>
                      <SelectItem value="EUR">🇪🇺 Euro (€)</SelectItem>
                      <SelectItem value="ARS">🇦🇷 Peso ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Avaliação</Label>
                <div className="flex gap-1 mt-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 cursor-pointer ${
                        i < (newWine.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                      onClick={() => setNewWine({ ...newWine, rating: i + 1 })}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={newWine.notes || ""}
                  onChange={(e) => setNewWine({ ...newWine, notes: e.target.value })}
                  placeholder="Suas impressões sobre o vinho..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="photo">Foto do Vinho</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <label htmlFor="photo-input" className="flex-1">
                      <div className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 transition-colors">
                        <Camera className="w-4 h-4" />
                        <span className="text-sm">Tirar Foto</span>
                      </div>
                      <input
                        id="photo-input"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoCapture}
                        className="hidden"
                      />
                    </label>
                    <label htmlFor="gallery-input" className="flex-1">
                      <div className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 transition-colors">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">Da Galeria</span>
                      </div>
                      <input
                        id="gallery-input"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoCapture}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {newWine.photo && newWine.photo !== "/placeholder.svg?height=200&width=200" && (
                    <div className="w-20 h-20 relative mx-auto">
                      <Image
                        src={newWine.photo || "/placeholder.svg"}
                        alt="Preview"
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddingWine(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleAddWine} className="flex-1 bg-purple-600 hover:bg-purple-700">
                  {editingWine ? "Atualizar" : "Salvar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Filter Button */}
        <div className="flex gap-2 mb-4">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex-1">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <Label className="text-sm font-medium mb-2 block">Ordenar por:</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">📅 Mais Recente</SelectItem>
                  <SelectItem value="date-asc">📅 Mais Antigo</SelectItem>
                  <SelectItem value="rating-desc">⭐ Maior Avaliação</SelectItem>
                  <SelectItem value="rating-asc">⭐ Menor Avaliação</SelectItem>
                  <SelectItem value="price-desc">💰 Maior Preço</SelectItem>
                  <SelectItem value="price-asc">💰 Menor Preço</SelectItem>
                  <SelectItem value="name-asc">🔤 Nome (A-Z)</SelectItem>
                  <SelectItem value="name-desc">🔤 Nome (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}

        {/* Wine List */}
        <div className="space-y-4">
          {getSortedWines().map((wine) => (
            <Card key={wine.id} className="overflow-hidden shadow-md">
              <CardContent className="p-0">
                <div className="flex">
                  <div className="w-24 h-24 relative bg-gray-100 flex-shrink-0">
                    <Image src={wine.photo || "/placeholder.svg"} alt={wine.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800 leading-tight">{wine.name}</h3>
                        <p className="text-sm text-gray-600">{wine.producer}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {wine.type && <Badge className={`text-xs ${getTypeColor(wine.type)}`}>{wine.type}</Badge>}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditWine(wine)}
                          className="h-6 w-6 p-0 hover:bg-purple-100"
                        >
                          <Edit className="w-3 h-3 text-purple-600" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mb-2">{renderStars(wine.rating)}</div>

                    <div className="space-y-1 text-xs text-gray-600">
                      {wine.vintage && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Safra {wine.vintage}</span>
                        </div>
                      )}
                      {wine.purchaseLocation && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{wine.purchaseLocation}</span>
                        </div>
                      )}
                      {wine.price && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          <span>
                            {getCurrencySymbol(wine.currency)} {wine.price}
                          </span>
                        </div>
                      )}
                    </div>

                    {wine.notes && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-700">
                        <div className="flex items-start gap-1">
                          <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>{wine.notes}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {getSortedWines().length === 0 && (
          <div className="text-center py-12">
            <WineIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum vinho cadastrado ainda</p>
            <p className="text-sm text-gray-400">Adicione o primeiro vinho ao catálogo!</p>
          </div>
        )}
      </div>
    </div>
  )
}
