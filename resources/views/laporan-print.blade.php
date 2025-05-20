<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Penjualan {{ $month }} {{ $year }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 20px;
        }
        h1 {
            text-align: center;
            margin-bottom: 30px;
            font-size: 24px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            font-size: 14px;
        }
        th, td {
            border: 1px solid #000;
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        .total-row {
            font-weight: bold;
            background-color: #f9f9f9;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .header-info {
            margin-bottom: 20px;
            text-align: center;
        }
        @media print {
            .no-print {
                display: none;
            }
            body {
                margin: 0;
                padding: 15px;
            }
            /* Pastikan semua elemen terlihat saat print */
            table, tr, td, th, tbody, thead, tfoot {
                page-break-inside: avoid;
                break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="header-info">
        <h1>Laporan Penjualan</h1>
        <p>Periode: {{ $month }} {{ $year }}</p>
    </div>
    
    <button class="no-print" onclick="window.print()" style="padding: 8px 16px; background-color: #4CAF50; color: white; border: none; cursor: pointer; margin-bottom: 20px; border-radius: 4px;">
        Print Laporan
    </button>
    
    <table>
        <thead>
            <tr>
                <th class="text-center">No</th>
                <th>Tanggal Beli</th>
                <th>Kode Order</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Barang</th>
                <th class="text-center">Quantity</th>
                <th class="text-right">Total Harga</th>
            </tr>
        </thead>
        <tbody>
            @if(count($reportData) > 0)
                @foreach($reportData as $index => $data)
                    <tr>
                        <td class="text-center">{{ $index + 1 }}</td>
                        <td>{{ $data['tanggal_beli'] }}</td>
                        <td>{{ $data['order_code'] }}</td>
                        <td>{{ $data['nama'] }}</td>
                        <td>{{ $data['email'] }}</td>
                        <td>{{ $data['barang'] }}</td>
                        <td class="text-center">{{ $data['quantity'] }}</td>
                        <td class="text-right">Rp {{ number_format($data['total_harga'], 0, ',', '.') }}</td>
                    </tr>
                @endforeach
            @else
                <tr>
                    <td colspan="8" class="text-center">Tidak ada data untuk periode ini</td>
                </tr>
            @endif
        </tbody>
        <tfoot>
            <tr class="total-row">
                <td colspan="6" class="text-right">Total Quantity</td>
                <td class="text-center">{{ collect($reportData)->sum('quantity') }}</td>
                <td class="text-right">Rp {{ number_format(collect($reportData)->sum('total_harga'), 0, ',', '.') }}</td>
            </tr>
        </tfoot>
    </table>
    
    <div style="margin-top: 50px; text-align: right;">
        <p>{{ date('d F Y') }}</p>
        <br><br><br>
        <p>_______________________</p>
        <p>Admin</p>
    </div>
    
    <script>
        // Auto print when page loads (optional)
        // window.onload = function() {
        //     window.print();
        // }
    </script>
</body>
</html>